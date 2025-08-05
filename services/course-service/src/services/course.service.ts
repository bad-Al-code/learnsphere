import { UserClient } from '../clients/user.client';
import logger from '../config/logger';
import { CourseRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import {
  Course,
  CourseLevel,
  CourseWithInstructor,
  CreateCourseDto,
  Requester,
  UpdateCourseDto,
} from '../types';
import { AuthorizationService } from './authorization.service';
import { CourseCacheService } from './course-cache.service';

export class CourseService {
  /**
   * A private helper to fetch instructor profiles for a list of courses and merge merge them into the course objects.
   * @param courses An array of course objects
   * @returns An array of CourseWiithInstructor objects
   */
  private static async _enrichCourseWithInstructors(courses: Course[]) {
    if (courses.length === 0) {
      return [];
    }

    const instructorIds = [...new Set(courses.map((c) => c.instructorId))];
    const instructorProfile = await UserClient.getPublicProfiles(instructorIds);

    return courses.map((course) => ({
      ...course,
      instructor: instructorProfile.get(course.instructorId),
    }));
  }

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

    await CourseCacheService.invalidateCourseList();

    return newCourse;
  }

  /**
   * Retrieves multiple courses by their IDs, including instructor details.
   * @param courseIds - An array of course IDs.
   */
  public static async getCoursesByIds(courseIds: string[]) {
    logger.info(`Fetching details for ${courseIds.length} courses in bulk`);
    const courseList = await CourseRepository.findManyIds(courseIds);

    return this._enrichCourseWithInstructors(courseList);
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
    const cachedCourse = await CourseCacheService.getCourseDetails(courseId);
    if (cachedCourse) {
      return cachedCourse;
    }

    logger.info(`Fetching full details for course: ${courseId}`);

    const courseDetails =
      await CourseRepository.findByIdWithRelations(courseId);

    if (!courseDetails) {
      throw new NotFoundError('Course');
    }

    const [result] = await this._enrichCourseWithInstructors([courseDetails]);

    await CourseCacheService.setCourseDetails(courseId, result);

    return result;
  }

  /**
   * Lists all published courses with pagination.
   * @param page - The page number.
   * @param limit - The number of results per page.
   * @returns A paginated result object.
   */
  public static async listCourses(
    page: number,
    limit: number,
    categoryId?: string,
    level?: CourseLevel
  ) {
    logger.info(
      `Fetching courses list from DB for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    const { totalResults, results: courseList } =
      await CourseRepository.listPublished(limit, offset, categoryId, level);

    const resultWithInstructors =
      await this._enrichCourseWithInstructors(courseList);

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
    requester: Requester
  ) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);

    const updatedCourse = await CourseRepository.update(courseId, data);

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Updated Course ${courseId} by user ${requester.id}`);

    return updatedCourse;
  }

  /**
   * Deletes a course after verifying ownership.
   * @param courseId - The ID of the course to delete.
   * @param requesterId - The ID of the user making the request.
   */
  public static async deleteCourse(
    courseId: string,
    requester: Requester
  ): Promise<void> {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);

    await CourseRepository.delete(courseId);

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Deleted course ${courseId} by user ${requester.id}`);
  }

  /**
   * Publishes a course after verifying ownership.
   * @param courseId - The ID of the course to publish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async publishCourse(courseId: string, requester: Requester) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);

    const course = await CourseRepository.findById(courseId);

    if (course?.status === 'published') {
      logger.warn(`Course ${courseId} is laready published. No action needed`);
      return course;
    }

    const updatedCourse = await CourseRepository.updateStatus(
      courseId,
      'published'
    );

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Published course ${courseId} by user ${requester.id}`);

    return updatedCourse;
  }

  /**
   * Unpublishes a course, returning it to a draft state, after verifying ownership.
   * @param courseId - The ID of the course to unpublish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async unPublishCourse(courseId: string, requester: Requester) {
    await AuthorizationService.verifyCourseOwnership(courseId, requester);

    const course = await CourseRepository.findById(courseId);
    if (course?.status === 'draft') {
      logger.warn(`Course ${courseId} is already in draft. No action needed`);
      return course;
    }

    logger.info(`Unpulishing course ${courseId} by user ${requester.id}`);

    const updatedCourse = await CourseRepository.updateStatus(
      courseId,
      'draft'
    );

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Unpublished course ${courseId} by user ${requester.id}`);

    return updatedCourse;
  }

  /**
   * Retrieves basic statistics related to courses.
   *
   * Currently returns:
   * - Total number of courses in the system.
   *
   * @returns {Promise<{ totalCourses: number }>} An object containing the total course count.
   */
  public static async getCourseStats() {
    const totalCourses = await CourseRepository.getTotalCount();
    return { totalCourses };
  }

  /**
   * Retrieves a paginated list of all courses for admin users, optionally filtered by a search query.
   *
   * This includes:
   * - Case-insensitive title search via `CourseRepository.searchAll`
   * - Pagination support (page & limit)
   * - Enriched course data with instructor information
   *
   * @param {string} query - Search keyword to filter course titles (optional).
   * @param {number} page - Current page number (1-indexed).
   * @param {number} limit - Number of results per page.
   * @returns {Promise<{
   *   results:[],
   *   pagination: {
   *     currentPage: number,
   *     totalPages: number,
   *     totalResults: number
   *   }
   * }>} Paginated list of courses with instructor details and metadata.
   */
  public static async listAllCoursesForAdmin(
    query: string,
    page: number,
    limit: number
  ) {
    const offset = (page - 1) * limit;
    const { totalResults, results } = await CourseRepository.searchAll(
      query,
      limit,
      offset
    );

    const resultsWithInstructors =
      await this._enrichCourseWithInstructors(results);

    const totalPages = Math.ceil(totalResults / limit);
    return {
      results: resultsWithInstructors,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
      },
    };
  }
}
