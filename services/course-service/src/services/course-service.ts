import { asc, count, eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses, lessons, modules } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../errors";
import { isGelSchema } from "drizzle-orm/gel-core";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}

interface ModuleData {
  title: string;
  courseId: string;
}

interface LessonData {
  title: string;
  moduleId: string;
  lessonType: "video" | "text" | "quiz";
}

interface UpdateCourseData {
  title?: string;
  description?: string;
}

interface UpdateModuleData {
  title?: string;
}

interface UpdateLessonData {
  title?: string;
  lessonType: "video" | "text" | "quiz";
}

export class CourseService {
  public static async createCourse(data: CreateCourseData) {
    logger.info(`Creating a new course`, {
      title: data.title,
      instructorId: data.instructorId,
    });

    const newCourse = await db
      .insert(courses)
      .values({
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
      })
      .returning();

    return newCourse[0];
  }

  public static async addModuleToCourse(data: ModuleData, requesterId: string) {
    logger.info(`Adding module "${data.title}" to course ${data.courseId}`);

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data.courseId),
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const moduleCountResult = await db
      .select({ value: count() })
      .from(modules)
      .where(eq(modules.courseId, data.courseId));
    const nextOrder = moduleCountResult[0].value;

    const newModule = await db
      .insert(modules)
      .values({
        title: data.title,
        courseId: data.courseId,
        order: nextOrder,
      })
      .returning();

    return newModule[0];
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

    const lessonCountResult = await db
      .select({ value: count() })
      .from(lessons)
      .where(eq(lessons.moduleId, data.moduleId));
    const nextOrder = lessonCountResult[0].value;

    const newLesson = await db
      .insert(lessons)
      .values({
        title: data.title,
        moduleId: data.moduleId,
        lessonType: data.lessonType,
        order: nextOrder,
      })
      .returning();

    return newLesson[0];
  }

  public static async listCourses(page: number, limit: number) {
    logger.info(`Fetching courses list for page: ${page}, limit: ${limit}`);

    const offset = (page - 1) * limit;

    const totalCourseQuery = db.select({ value: count() }).from(courses);

    const courseQuery = db.query.courses.findMany({
      limit,
      offset,
    });

    const [total, courseList] = await Promise.all([
      totalCourseQuery,
      courseQuery,
    ]);

    const totalResult = total[0].value;
    const totalPages = Math.ceil(totalResult / limit);

    return {
      results: courseList,
      pagination: {
        currentPage: page,
        totalPages,
        totalResult,
      },
    };
  }

  public static async getCourseDetails(courseId: string) {
    logger.info(`Fetching full details for course: ${courseId}`);

    const courseDetails = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: [asc(modules.order)],
          with: {
            lessons: {
              orderBy: [asc(lessons.order)],
            },
          },
        },
      },
    });

    if (!courseDetails) {
      throw new NotFoundError("Course");
    }

    return courseDetails;
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

  public static async getLessonDetails(lessonId: string) {
    logger.info(`Fetching details for lesson: ${lessonId}`);

    const lessonDetails = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
    });

    if (!lessonDetails) {
      throw new NotFoundError("Lesson");
    }
    return lessonDetails;
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

    return updatedCourse[0];
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

    return updatedModule[0];
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

    const updatedLesson = await db
      .update(lessons)
      .set(data)
      .where(eq(lessons.id, lessonId))
      .returning();

    return updatedLesson[0];
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
  }
}
