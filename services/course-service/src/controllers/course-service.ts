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
