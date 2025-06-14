import { eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses, modules } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../errors";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}

interface ModuleData {
  title: string;
  courseId: string;
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

    const newModule = await db
      .insert(modules)
      .values({
        title: data.title,
        courseId: data.courseId,
      })
      .returning();

    return newModule[0];
  }
}
