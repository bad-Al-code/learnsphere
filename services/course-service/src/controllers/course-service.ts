import { asc, count, eq, inArray } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses, lessons, modules, textLessonContent } from "../db/schema";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import axios from "axios";
import { CacheService } from "./cache-service";
import { CourseRepository } from "../db/course.repository";
import { ModuleRepository } from "../db/module.repository";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}

interface UpdateCourseData {
  title?: string;
  description?: string;
}

interface ModuleData {
  title: string;
  courseId: string;
}

interface UpdateModuleData {
  title?: string;
}

interface LessonData {
  title: string;
  moduleId: string;
  lessonType: "video" | "text" | "quiz";
  content?: string;
}

interface UpdateLessonData {
  title?: string;
  lessonType: "video" | "text" | "quiz";
  content?: string;
}

interface InstructorProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  avatarUrls?: { small?: string; medium?: string; large?: string };
}

type BaseCourse = typeof courses.$inferSelect;
type CourseWithInstructor = BaseCourse & { instructor?: InstructorProfile };

export class CourseService {
  private static async getInstructorProfiles(
    instructorIds: string[]
  ): Promise<Map<string, InstructorProfile>> {
    const userServiceUrl = process.env.USER_SERVICE_URL;
    if (!userServiceUrl || instructorIds.length === 0) {
      return new Map();
    }

    try {
      const profilePromises = instructorIds.map((id) =>
        axios.get<InstructorProfile>(`${userServiceUrl}/api/users/${id}`)
      );

      const responses = await Promise.all(
        profilePromises.map((p) => p.catch((e) => e))
      );

      const profilesMap = new Map<string, InstructorProfile>();
      responses.forEach((response) => {
        if (response?.status === 200 && response.data) {
          profilesMap.set(response.data.userId, response.data);
        }
      });

      return profilesMap;
    } catch (error) {
      logger.error("Failed to fetch instructor profiles from user-service", {
        error,
      });
      return new Map();
    }
  }

  public static async createCourse(data: CreateCourseData) {
    logger.info(`Creating a new course`, {
      title: data.title,
      instructorId: data.instructorId,
    });

    const newCourse = await CourseRepository.create({
      title: data.title,
      description: data.description,
      instructorId: data.instructorId,
    });

    await CacheService.delByPattern("course:list:*");

    return newCourse;
  }

  public static async getCourseByIds(courseIds: string[]) {
    logger.info(`Fetching details for ${courseIds.length} courses in bulk`);

    const courseList = await db.query.courses.findMany({
      where: inArray(courses.id, courseIds),
    });

    const instructorIds = [...new Set(courseList.map((c) => c.instructorId))];
    const instructorProfiles = await this.getInstructorProfiles(instructorIds);

    const results = courseList.map((course) => ({
      ...course,
      instructor: instructorProfiles.get(course.instructorId) || null,
    }));

    return results;
  }

  public static async getCourseDetails(courseId: string) {
    const cacheKey = `course:details:${courseId}`;

    const cachedCourse = await CacheService.get<any>(cacheKey);
    if (cachedCourse) {
      return cachedCourse;
    }

    logger.info(`Fetching full details for course: ${courseId}`);

    const courseDetails = await CourseRepository.findByIdWithRelations(
      courseId
    );

    if (!courseDetails) {
      throw new NotFoundError("Course");
    }

    const instructorProfiles = await this.getInstructorProfiles([
      courseDetails.instructorId,
    ]);
    const resultWithInstructors = {
      ...courseDetails,
      instructor: instructorProfiles.get(courseDetails.instructorId),
    };

    const result = resultWithInstructors;

    await CacheService.set(cacheKey, result);

    return result;
  }

  public static async listCourses(page: number, limit: number) {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestError("Page and limit must be positive integers");
    }
    const cacheKey = `courses:list:page:${page}:limit:${limit}`;

    const cachedCourses = await CacheService.get<any>(cacheKey);
    if (cachedCourses) {
      return cachedCourses;
    }

    logger.info(
      `Fetching courses list from DB for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    const whereClause = eq(courses.status, "published");
    const totalCourseQuery = db
      .select({ value: count() })
      .from(courses)
      .where(whereClause);

    const courseQuery = db.query.courses.findMany({
      where: whereClause,
      limit,
      offset,
    });

    const [total, courseList] = await Promise.all([
      totalCourseQuery,
      courseQuery,
    ]);

    const instructorIds = [...new Set(courseList.map((c) => c.instructorId))];
    const instructorProfile = await this.getInstructorProfiles(instructorIds);
    const resultWithInstructors: CourseWithInstructor[] = courseList.map(
      (course) => ({
        ...course,
        instructor: instructorProfile.get(course.instructorId),
      })
    );

    const totalResult = total[0].value;
    const totalPages = Math.ceil(totalResult / limit);
    const result = {
      results: resultWithInstructors,
      pagination: {
        currentPage: page,
        totalPages,
        totalResult,
      },
    };
    await CacheService.set(cacheKey, result);

    return result;
  }

  public static async updateCourse(
    courseId: string,
    data: UpdateCourseData,
    requesterId: string
  ) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) throw new NotFoundError("Course");
    if (course.instructorId !== requesterId) throw new ForbiddenError();

    const updatedCourse = await db
      .update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    logger.info(`Updated Course ${courseId} by user ${requesterId}`);

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern(`course:list:*`);

    return updatedCourse[0];
  }

  public static async deleteCourse(courseId: string, requesterId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) {
      throw new NotFoundError("Course");
    }
    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    logger.info(`Deleting course ${courseId} by user ${requesterId}`);

    await db.delete(courses).where(eq(courses.id, courseId));

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern(`course:list:*`);
  }

  public static async addModuleToCourse(data: ModuleData, requesterId: string) {
    logger.info(`Adding module "${data.title}" to course ${data.courseId}`);

    const course = await CourseRepository.findById(data.courseId);

    if (!course) {
      throw new NotFoundError("Course");
    }

    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const nextOrder = await ModuleRepository.coundByCourseId(data.courseId);

    const newModule = await ModuleRepository.create({
      title: data.title,
      courseId: data.courseId,
      order: nextOrder,
    });

    await CacheService.del(`course:details:${data.courseId}`);

    return newModule;
  }

  public static async getModuleForCourse(courseId: string) {
    logger.info(`Fetching all modules for course: ${courseId}`);

    const courseExists = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      columns: { id: true },
    });
    if (!courseExists) {
      throw new NotFoundError("Course");
    }

    return db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
      orderBy: [asc(modules.order)],
    });
  }

  public static async getModuleDetails(moduleId: string) {
    logger.info(`Fetching details for module: ${moduleId}`);

    const moduleDetails = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: {
        lessons: {
          orderBy: [asc(lessons.order)],
        },
      },
    });

    if (!moduleDetails) {
      throw new NotFoundError("Module");
    }
    return moduleDetails;
  }

  public static async updateModule(
    moduleId: string,
    data: UpdateModuleData,
    requesterId: string
  ) {
    const parentModule = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: { course: true },
    });
    if (!parentModule) {
      throw new NotFoundError("Module");
    }
    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const updatedModule = await db
      .update(modules)
      .set(data)
      .where(eq(modules.id, moduleId))
      .returning();

    await CacheService.del(`course:details:${parentModule.courseId}`);

    return updatedModule[0];
  }

  public static async deleteModule(moduleId: string, requesterId: string) {
    const parentModule = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: { course: true },
    });
    if (!parentModule) {
      throw new NotFoundError("Module");
    }
    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    logger.info(`Deleting module ${moduleId} by user ${requesterId}`);

    await db.delete(modules).where(eq(modules.id, moduleId));

    await CacheService.del(`course:details:${parentModule.courseId}`);
  }

  public static async reorderModules(
    orderModuleIds: string[],
    requesterId: string
  ) {
    if (orderModuleIds.length === 0) {
      return;
    }

    await db.transaction(async (tx) => {
      const allModules = await tx.query.modules.findMany({
        where: (modules, { inArray }) => inArray(modules.id, orderModuleIds),
        with: { course: true },
      });

      if (allModules.length !== orderModuleIds.length) {
        throw new BadRequestError("One or more moduls IDs are invalid");
      }

      const parentCourseId = allModules[0].course.id;
      const ownerId = allModules[0].course.instructorId;

      const allModulesFromSameCourse = allModules.every(
        (m) => m.courseId === parentCourseId
      );
      if (!allModulesFromSameCourse || ownerId !== requesterId) {
        throw new ForbiddenError();
      }

      logger.info(
        `Reordering ${allModules.length} modules for course ${parentCourseId}`
      );

      const updatePromises = orderModuleIds.map((id, index) => {
        return tx
          .update(modules)
          .set({ order: index })
          .where(eq(modules.id, id));
      });

      await Promise.all(updatePromises);
      await CacheService.del(`course:details:${parentCourseId}`);
    });
  }

  public static async addLessonToModule(data: LessonData, requesterId: string) {
    logger.info(`Adding lesson "${data.title}" to moduke ${data.moduleId}`);

    const parentModule = await db.query.modules.findFirst({
      where: eq(modules.id, data.moduleId),
      with: {
        course: true,
      },
    });

    if (!parentModule) {
      throw new NotFoundError("Module");
    }

    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const newLessonData = await db.transaction(async (tx) => {
      const lessonCountResult = await tx
        .select({ value: count() })
        .from(lessons)
        .where(eq(lessons.moduleId, data.moduleId));

      const nextOrder = lessonCountResult[0].value;

      const insertedLessons = await tx
        .insert(lessons)
        .values({
          title: data.title,
          moduleId: data.moduleId,
          lessonType: data.lessonType,
          order: nextOrder,
        })
        .returning();

      const newLesson = insertedLessons[0];

      if (
        data.lessonType === "text" &&
        data.content &&
        data.content.length > 0
      ) {
        await tx.insert(textLessonContent).values({
          lessonId: newLesson.id,
          content: data.content,
        });
      }
      return newLesson;
    });

    const finalLessonDetails = await this.getLessonDetails(newLessonData.id);

    await CacheService.del(`course:details:${parentModule.courseId}`);

    return finalLessonDetails;
  }

  public static async getLessonDetails(lessonId: string) {
    logger.info(`Fetching details for lesson: ${lessonId}`);

    const lessonDetails = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { textContent: true },
    });

    if (!lessonDetails) {
      throw new NotFoundError("Lesson");
    }
    return lessonDetails;
  }

  public static async updateLesson(
    lessonId: string,
    data: UpdateLessonData,
    requesterId: string
  ) {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
    if (!lesson) {
      throw new NotFoundError("Lesson");
    }
    if (lesson.module.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    await db.transaction(async (tx) => {
      const { content, ...lessonData } = data;
      if (Object.keys(lessonData).length > 0) {
        await tx
          .update(lessons)
          .set(data)
          .where(eq(lessons.id, lessonId))
          .returning();
      }

      if (data.lessonType === "text" && typeof data.content !== "undefined") {
        await tx
          .insert(textLessonContent)
          .values({ lessonId, content: data.content })
          .onConflictDoUpdate({
            target: textLessonContent.lessonId,
            set: { content: data.content },
          });
      }

      const finalLessonDetails = await this.getLessonDetails(lessonId);

      await CacheService.del(`course:details:${lesson.module.courseId}`);

      return finalLessonDetails;
    });
  }

  public static async deleteLesson(lessonId: string, requesterId: string) {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
    if (!lesson) {
      throw new NotFoundError("Parent Module");
    }
    if (lesson.module.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    logger.info(`Deleting lesson ${lessonId} by user ${requesterId}`);

    await db.delete(lessons).where(eq(lessons.id, lessonId));

    await CacheService.del(`course:details:${lesson.module.courseId}`);
  }

  public static async reorderLessons(
    orderedLessonIds: string[],
    requesterId: string
  ) {
    if (orderedLessonIds.length === 0) {
      return;
    }

    await db.transaction(async (tx) => {
      const allLessons = await tx.query.lessons.findMany({
        where: (lessons, { inArray }) => inArray(lessons.id, orderedLessonIds),
        with: { module: { with: { course: true } } },
      });

      if (allLessons.length !== orderedLessonIds.length) {
        throw new BadRequestError("One or more lessons IDs are invalid");
      }

      const parentModuleId = allLessons[0].moduleId;
      const ownerId = allLessons[0].module.course.instructorId;
      const allLessonsFromSameModule = allLessons.every(
        (l) => l.moduleId === parentModuleId
      );

      if (!allLessonsFromSameModule || ownerId !== requesterId) {
        throw new ForbiddenError();
      }

      logger.info(
        `Reordering ${allLessons.length} lessons from whole ${parentModuleId}`
      );

      const updatePromises = orderedLessonIds.map((id, index) => {
        return tx
          .update(lessons)
          .set({ order: index })
          .where(eq(lessons.id, id));
      });

      await Promise.all(updatePromises);

      await CacheService.del(`course:details:${allLessons[0].module.courseId}`);
    });
  }

  public static async publishCourse(courseId: string, requesterId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) {
      throw new NotFoundError("Course");
    }
    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    if (course.status === "published") {
      logger.warn(`Course ${courseId} is laready published. No action needed`);
      return course;
    }

    logger.info(`Publishing course ${courseId} by user ${requesterId}`);

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern("courses:list:*");

    const updatedCourse = await db
      .update(courses)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse[0];
  }

  public static async unPublishCourse(courseId: string, requesterId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    if (!course) {
      throw new NotFoundError("Course");
    }
    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    if (course.status === "draft") {
      logger.warn(`Course ${courseId} is already in draft. No action needed`);
      return course;
    }

    logger.info(`Unpulishing course ${courseId} by user ${requesterId}`);

    const updatedCourse = await db
      .update(courses)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern("courses:list:*");

    return updatedCourse[0];
  }

  public static async requestVideoUploadUrl(
    lessonId: string,
    filename: string,
    requesterId: string
  ) {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
    if (!lesson) {
      throw new NotFoundError("Lesson");
    }
    if (lesson.module.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }
    if (lesson.lessonType !== "video") {
      throw new BadRequestError("This lesson is not a video lesson");
    }

    const mediaServiceUrl = process.env.MEDIA_SERVICE_URL!;
    logger.info(
      `Requesting video upload URL from media-serice for lesson: ${lessonId}`
    );

    try {
      const response = await axios.post(
        `${mediaServiceUrl}/api/media/request-upload-url`,
        {
          filename,
          uploadType: "video",
          metadata: { lessonId: lessonId },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(`Error contacting media-service for video upload URL`, {
        error,
      });

      throw new Error("Could not create video upload url");
    }
  }
}
