import logger from "../config/logger";
import { db } from "../db";
import { courses } from "../db/schema";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
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
}
