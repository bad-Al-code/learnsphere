import { UserClient } from '../clients/user.client';
import logger from '../config/logger';
import { CourseRepository } from '../db/repostiories';
import { CourseLevel } from '../db/schema';
import { NotFoundError } from '../errors';
import {
  CourseCreatedPublisher,
  CourseDeletedPublisher,
  CourseUpdatedPublisher,
} from '../events/publisher';
import { CreateFullCourseDto, GetCoursesByInstructorOptions } from '../schemas';
import {
  Course,
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

  private static calculatePercentageChange(
    current: number,
    previous: number
  ): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  private static formatDuration(totalMinutes: number): string {
    if (totalMinutes === 0) return '0m';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';

    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;

    return result.trim();
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

    try {
      const publisher = new CourseCreatedPublisher();
      await publisher.publish({
        courseId: newCourse.id,
        instructorId: newCourse.instructorId,
        status: newCourse.status,
        prerequisiteCourseId: newCourse.prerequisiteCourseId,
        price: newCourse.price,
        currency: newCourse.currency,
      });
    } catch (error) {
      logger.error('Failed to publish course.created event', {
        error,
        courseId: newCourse.id,
      });
    }

    await CourseCacheService.invalidateCourseList();

    return newCourse;
  }

  /**
   * @static
   * @async
   * @method createFullCourse
   * @description Orchestrates the creation of a new course. It delegates the database
   * insertion to the repository and then handles side-effects like event publishing
   * and cache invalidation.
   *
   * @param {string} instructorId - The UUID of the user creating the course.
   * @param {CreateFullCourseDto} data - The DTO containing course and module details.
   * @returns {Promise<Course>} A promise that resolves to the newly created course object.
   */
  public static async createFullCourse(
    instructorId: string,
    data: CreateFullCourseDto
  ) {
    const newCourse = await CourseRepository.createFullCourse(
      instructorId,
      data
    );

    try {
      const publisher = new CourseCreatedPublisher();
      await publisher.publish({
        courseId: newCourse.id,
        instructorId: newCourse.instructorId,
        status: newCourse.status,
        prerequisiteCourseId: newCourse.prerequisiteCourseId,
        price: newCourse.price,
        currency: newCourse.currency,
      });
    } catch (error) {
      logger.error('Failed to publish course.created event', {
        error,
        courseId: newCourse.id,
      });
    }

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

    const enrichedModules = courseDetails.modules.map((module) => {
      const totalDuration = module.lessons.reduce(
        (sum, lesson) => sum + (lesson.duration || 0),
        0
      );
      return {
        ...module,
        lessonCount: module.lessons.length,
        totalDuration: this.formatDuration(totalDuration),
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          duration: this.formatDuration(lesson.duration || 0),
        })),
      };
    });

    const enrichedCourse = { ...courseDetails, modules: enrichedModules };

    const [result] = await this._enrichCourseWithInstructors([enrichedCourse]);

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

    try {
      const publisher = new CourseUpdatedPublisher();
      await publisher.publish({
        courseId: updatedCourse.id,
        newPrerequisiteCourseId: updatedCourse.prerequisiteCourseId,
        newPrice: updatedCourse.price,
      });
    } catch (error) {
      logger.error('Failed to publish course.updated event', {
        error,
        courseId,
      });
    }

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

    try {
      const publisher = new CourseDeletedPublisher();
      await publisher.publish({
        courseId,
      });
    } catch (error) {
      logger.error('Failed to publish course.deleted event', {
        error,
        courseId,
      });
    }

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

    try {
      const publisher = new CourseUpdatedPublisher();
      await publisher.publish({
        courseId: updatedCourse.id,
        newStatus: updatedCourse.status,
      });
    } catch (error) {
      logger.error(
        'Failed to publish course.updated event for publish action',
        { error, courseId }
      );
    }

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

    try {
      const publisher = new CourseUpdatedPublisher();
      await publisher.publish({
        courseId: updatedCourse.id,
        newStatus: updatedCourse.status,
      });
    } catch (error) {
      logger.error(
        'Failed to publish course.updated event for unpublish action',
        { error, courseId }
      );
    }

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

  public static async searchPublicCourses(query: string) {
    return CourseRepository.findPublishedByTitle(query);
  }

  public static async getCoursesForInstructor(
    options: GetCoursesByInstructorOptions
  ) {
    const { totalResults, results } =
      await CourseRepository.findAndFilterByInstructorId(options);

    const totalPages = Math.ceil(totalResults / options.limit);

    return {
      results: results,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalResults,
      },
    };
  }

  /**
   * Retrieves statistics for an instructor, including total courses and average rating.
   * @param instructorId The ID of the instructor.
   * @returns An object containing the instructor's course stats.
   */
  public static async getInstructorStats(instructorId: string) {
    const stats = await CourseRepository.getInstructorCourseStats(instructorId);

    const activeCoursesChange = this.calculatePercentageChange(
      stats.coursesThisPeriod,
      stats.coursesLastPeriod
    );

    const averageRatingChange = 10;

    return {
      activeCourses: {
        value: stats.totalCourses,
        change: activeCoursesChange,
      },
      averageRating: {
        value: parseFloat(stats.averageRating),
        change: averageRatingChange, // NOTE: Still a placeholder as we don't store historical ratings
      },
    };
  }
}
