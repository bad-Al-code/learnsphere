import { count, eq } from "drizzle-orm";
import { UserClient } from "../clients/user.client";
import logger from "../config/logger";
import { CacheService } from "../controllers/cache-service";
import { CourseRepository } from "../db/course.repository";
import { BadRequestError, NotFoundError } from "../errors";
import { CourseWithInstructor, CreateCourseDto } from "../types";
import { courses, courseStatusEnum } from "../db/schema";
import { db } from "../db";

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

  /**
   * Retrieves the full details of a single course, including modules,
   * lessons, and instructor profile.
   * @param courseId - The ID of the course to fetch.
   * @returns The detailed course object.
   */
  public static async getCourseDetails(
    courseId: string
  ): Promise<CourseWithInstructor> {
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

    const instructorProfiles = await UserClient.getPublicProfile([
      courseDetails.instructorId,
    ]);
    const result: CourseWithInstructor = {
      ...courseDetails,
      instructor: instructorProfiles.get(courseDetails.instructorId) || null,
    };

    await CacheService.set(cacheKey, result);

    return result;
  }

  /**
   * Lists all published courses with pagination.
   * @param page - The page number.
   * @param limit - The number of results per page.
   * @returns A paginated result object.
   */
  public static async listCourses(page: number, limit: number) {
    // if (page <= 0 || limit <= 0) {
    //   throw new BadRequestError("Page and limit must be positive integers");
    // }
    // const cacheKey = `courses:list:page:${page}:limit:${limit}`;

    // const cachedCourses = await CacheService.get<any>(cacheKey);
    // if (cachedCourses) {
    //   return cachedCourses;
    // }

    logger.info(
      `Fetching courses list from DB for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    const { totalResults, results: courseList } =
      await CourseRepository.listPublished(limit, offset);

    const instructorIds = [...new Set(courseList.map((c) => c.instructorId))];
    const instructorProfile = await UserClient.getPublicProfile(instructorIds);

    const resultWithInstructors: CourseWithInstructor[] = courseList.map(
      (course) => ({
        ...course,
        instructor: instructorProfile.get(course.instructorId) || null,
      })
    );

    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results: resultWithInstructors,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
      },
    };
    // await CacheService.set(cacheKey, result);

    return result;
  }
}
