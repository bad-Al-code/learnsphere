import logger from "../config/logger";
import { CacheService } from "../controllers/cache-service";
import { CourseRepository } from "../db/course.repository";
import { CreateCourseDto } from "../types";

export class CourseService {
  /**
   * Creates a new course.
   * @param data - Contains title, description, and instructorId.
   * @returns The newly created course.
   */
  public static async createCourse(data: CreateCourseDto) {
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
}
