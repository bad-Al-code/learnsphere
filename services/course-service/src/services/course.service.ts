import { UserClient } from '../clients/user.client';
import logger from '../config/logger';
import { CourseRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import {
  Course,
  CourseWithInstructor,
  CreateCourseDto,
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
      instrctor: instructorProfile.get(course.instructorId),
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
  public static async listCourses(page: number, limit: number) {
    logger.info(
      `Fetching courses list from DB for page: ${page}, limit: ${limit}`
    );

    const offset = (page - 1) * limit;

    const { totalResults, results: courseList } =
      await CourseRepository.listPublished(limit, offset);

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
    requesterId: string
  ) {
    await AuthorizationService.verifyCourseOwnership(courseId, requesterId);

    const updatedCourse = await CourseRepository.update(courseId, data);

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

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
    await AuthorizationService.verifyCourseOwnership(courseId, requesterId);

    await CourseRepository.delete(courseId);

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Deleted course ${courseId} by user ${requesterId}`);
  }

  /**
   * Publishes a course after verifying ownership.
   * @param courseId - The ID of the course to publish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async publishCourse(courseId: string, requesterId: string) {
    await AuthorizationService.verifyCourseOwnership(courseId, requesterId);

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

    logger.info(`Published course ${courseId} by user ${requesterId}`);

    return updatedCourse;
  }

  /**
   * Unpublishes a course, returning it to a draft state, after verifying ownership.
   * @param courseId - The ID of the course to unpublish.
   * @param requesterId - The ID of the user making the request.
   */
  public static async unPublishCourse(courseId: string, requesterId: string) {
    await AuthorizationService.verifyCourseOwnership(courseId, requesterId);

    const course = await CourseRepository.findById(courseId);
    if (course?.status === 'draft') {
      logger.warn(`Course ${courseId} is already in draft. No action needed`);
      return course;
    }

    logger.info(`Unpulishing course ${courseId} by user ${requesterId}`);

    const updatedCourse = await CourseRepository.updateStatus(
      courseId,
      'draft'
    );

    await CourseCacheService.invalidateCacheDetails(courseId);
    await CourseCacheService.invalidateCourseList();

    logger.info(`Unpublished course ${courseId} by user ${requesterId}`);

    return updatedCourse;
  }
}
