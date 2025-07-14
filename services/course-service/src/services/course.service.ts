import { UserClient } from "../clients/user.client";
import logger from "../config/logger";
import { CacheService } from "../controllers/cache-service";
import { CourseRepository } from "../db/course.repository";
import { ForbiddenError, NotFoundError } from "../errors";
import { courseRouter } from "../routes";
import {
  CourseWithInstructor,
  CreateCourseDto,
  UpdateCourseDto,
} from "../types";

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

    return result;
  }

  /**
   * Updates a course's data after verifying ownership.
   * @param courseId - The ID of the course to update.
   * @param data - The new data for the course.
   * @param requesterId - The ID of the user making the request.
   */
  public static async updateCourse(
    courseId: string,
    data: UpdateCourseDto,
    requesterId: string
  ) {
    const course = await CourseRepository.findById(courseId);
    if (!course) throw new NotFoundError("Course");
    if (course.instructorId !== requesterId) throw new ForbiddenError();

    const updatedCourse = await CourseRepository.update(courseId, data);

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern(`course:list:*`);

    logger.info(`Updated Course ${courseId} by user ${requesterId}`);

    return updatedCourse;
  }

  /**
   * Deletes a course after verifying ownership.
   * @param courseId - The ID of the course to delete.
   * @param requesterId - The ID of the user making the request.
   */
  public static async deleteCourse(
    courseId: string,
    requesterId: string
  ): Promise<void> {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course");
    }
    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    await CourseRepository.delete(courseId);

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern(`course:list:*`);

    logger.info(`Deleted course ${courseId} by user ${requesterId}`);
  }

  /**
   * Publishes a course after verifying ownership.
   * @param courseId - The ID of the course to publish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async publishCourse(courseId: string, requesterId: string) {
    const course = await CourseRepository.findById(courseId);
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

    const updatedCourse = await CourseRepository.updateStatus(
      courseId,
      "published"
    );

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern("courses:list:*");

    logger.info(`Published course ${courseId} by user ${requesterId}`);

    return updatedCourse;
  }

  /**
   * Unpublishes a course, returning it to a draft state, after verifying ownership.
   * @param courseId - The ID of the course to unpublish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async unPublishCourse(courseId: string, requesterId: string) {
    const course = await CourseRepository.findById(courseId);
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

    const updatedCourse = await CourseRepository.updateStatus(
      courseId,
      "draft"
    );

    await CacheService.del(`course:details:${courseId}`);
    await CacheService.delByPattern("courses:list:*");

    logger.info(`Unpublished course ${courseId} by user ${requesterId}`);

    return updatedCourse;
  }
}
