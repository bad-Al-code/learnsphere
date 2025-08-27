import axios, { isAxiosError } from 'axios';
import { count, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../config/logger';
import { db } from '../db';
import {
  AnalyticsRepository,
  CourseRepository,
  EnrollRepository,
} from '../db/repositories';
import { enrollments } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
  StudentCourseCompletedPublisher,
  StudentProgressResetPublisher,
  StudentProgressUpdatePublisher,
  UserEnrollmentPublisher,
  UserEnrollmentReactivatedPublisher,
  UserEnrollmentSuspendedPublisher,
} from '../events/publisher';
import {
  ChangeEnrollmentStatus,
  CourseStructureSnapshotDetails,
  GetEnrollmentsOptions,
  ManualEnrollmentData,
  MarkProgressData,
  PublicCourseData,
  PublicUserData,
  ResetProgressData,
  UserEnrollmentData,
  UserEnrollmentStatus,
} from '../types';
import { CacheService } from './cache.service';

export class EnrollmentService {
  private static async invalidateUserEnrollmentCache(userId: string) {
    const cacheKey = `enrollments:user:${userId}`;

    await CacheService.del(cacheKey);
  }

  // private static async getValidCourseEnrollment(
  //   courseId: string
  // ): Promise<CourseDetails> {
  //   const courseServiceUrl = process.env.COURSE_SERVICE_URL!;
  //   if (!courseServiceUrl) {
  //     throw new Error(`COURSE_SERVICE_URL is not defined`);
  //   }

  //   try {
  //     logger.debug(`Fetching user details for ${courseId} from course-service`);
  //     const response = await axios.get<CourseDetails>(
  //       `${courseServiceUrl}/api/courses/${courseId}`
  //     );
  //     if (response.data.status !== 'published') {
  //       throw new BadRequestError('Enrollment Failed. Course is not published');
  //     }

  //     return response.data;
  //   } catch (error) {
  //     if (isAxiosError(error) && error.response?.status === 404) {
  //       throw new NotFoundError('Course');
  //     }

  //     throw error;
  //   }
  // }

  /**
   * Fetches the detailed structure (modules and lessons) of a course.
   * This is called only at the moment of enrollment to create a durable snapshot.
   * @param courseId The ID of the course.
   * @returns The course structure.
   */
  private static async getCourseStructureForSnapshot(
    courseId: string
  ): Promise<CourseStructureSnapshotDetails> {
    const courseServiceUrl = process.env.COURSE_SERVICE_URL!;
    try {
      const response = await axios.get<CourseStructureSnapshotDetails>(
        `${courseServiceUrl}/api/courses/${courseId}`
      );
      return response.data;
    } catch (error) {
      logger.error(
        `Failed to fetch course structure for snapshot for course ${courseId}`,
        { error }
      );
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError('Course');
      }
      throw new Error('Could not retrieve course structure for enrollment.');
    }
  }

  private static createCourseStructureSnapshot(
    course: CourseStructureSnapshotDetails
  ) {
    let totalLessons = 0;
    const totalModules = course.modules.length;
    const moduleSnapshots = course.modules.map((module) => {
      const lessonIds = module.lessons.map((lesson) => lesson.id);
      totalLessons += lessonIds.length;
      return {
        id: module.id,
        title: module.title,
        lessonIds: lessonIds,
      };
    });

    return {
      totalModules: totalModules,
      totalLessons: totalLessons,
      modules: moduleSnapshots,
    };
  }

  private static async hasCompletedCourse(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const prerequisiteEnrollment = await EnrollRepository.findByUserAndCourse(
      userId,
      courseId
    );

    return prerequisiteEnrollment?.status === 'completed';
  }

  public static async checkEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;
      const { courseId } = req.params;
      const enrollment = await EnrollRepository.findByUserAndCourse(
        userId,
        courseId
      );

      if (!enrollment || enrollment.status !== 'active') {
        throw new NotFoundError('Enrollment');
      }

      res.status(StatusCodes.OK).json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  public static async enrollUserInCourse({
    userId,
    courseId,
  }: UserEnrollmentData) {
    logger.info(`Attempting to enroll user ${userId} in course ${courseId}`);

    const existingEnrollment = await EnrollRepository.findByUserAndCourse(
      userId,
      courseId
    );

    if (existingEnrollment) {
      throw new BadRequestError(`User is already enrolled in this course`);
    }

    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError(
        'Course not found or has not been synchronized yet.'
      );
    }

    if (course.status !== 'published') {
      throw new BadRequestError('Enrollment failed. Course is not published');
    }

    if (course.prerequisiteCourseId) {
      const hasCompletedPreq = await this.hasCompletedCourse(
        userId,
        course.prerequisiteCourseId
      );
      if (!hasCompletedPreq) {
        throw new ForbiddenError(
          `Enrollment failed. Please complete the prerequisite course first.`
        );
      }

      logger.info(
        `User ${userId} has met the prerequisites for course ${courseId}`
      );
    }

    const courseStructureData =
      await this.getCourseStructureForSnapshot(courseId);
    const courseStructure =
      this.createCourseStructureSnapshot(courseStructureData);

    if (courseStructure.totalLessons === 0) {
      throw new BadRequestError('Cannot enroll in a course with no lessons.');
    }

    const newEnrollment = await EnrollRepository.create({
      userId,
      courseId,
      courseStructure,
      coursePriceAtEnrollment: course.price || '0.00',
    });

    logger.info(`User ${userId} successfully enrolled in course ${courseId}`);

    try {
      await AnalyticsRepository.createActivityLog({
        courseId: newEnrollment.courseId,
        userId: newEnrollment.userId,
        activityType: 'enrollment',
        metadata: { enrollmentId: newEnrollment.id },
        createdAt: newEnrollment.enrolledAt,
      });

      logger.info(
        `Logged 'enrollment' activity for course ${newEnrollment.courseId}`
      );
    } catch (error) {
      logger.error('Failed to log enrollment activity', {
        enrollmentId: newEnrollment.id,
        error,
      });
    }

    const publiser = new UserEnrollmentPublisher();
    await publiser.publish({
      userId: newEnrollment.userId,
      courseId: newEnrollment.courseId,
      enrolledAt: newEnrollment.enrolledAt,
      enrollmentId: newEnrollment.id,
      instructorId: course.instructorId,
    });

    await this.invalidateUserEnrollmentCache(userId);

    return newEnrollment;
  }

  private static async getCourseInBatch(
    courseIds: string[]
  ): Promise<Map<string, PublicCourseData>> {
    if (courseIds.length === 0) {
      return new Map();
    }

    const courseServiceUrl = process.env.COURSE_SERVICE_URL;
    if (!courseServiceUrl) {
      throw new Error(`COURSE_SERVICE_URL is not defined`);
    }

    try {
      logger.debug(
        `Batch fetching ${courseIds.length} course from course-service`
      );

      const response = await axios.post<PublicCourseData[]>(
        `${courseServiceUrl}/api/courses/bulk`,
        { courseIds }
      );

      const courseMap = new Map<string, PublicCourseData>();
      for (const course of response.data) {
        courseMap.set(course.id, course);
      }

      return courseMap;
    } catch (error) {
      let errorDetails: object = { message: (error as Error).message };
      if (isAxiosError(error)) {
        errorDetails = {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data,
        };
      }

      logger.error('Failed to batch fetch course from course-service: %o', {
        error: errorDetails,
      });

      return new Map();
    }
  }

  public static async getEnrollmentsByUserId(userId: string) {
    const cacheKey = `enrollments:user:${userId}`;
    const cachedEnrollments = await CacheService.get<unknown[]>(cacheKey);
    if (cachedEnrollments) {
      return cachedEnrollments;
    }

    logger.debug(
      `Fetching all active and completed enrollments for user ${userId} from db.`
    );

    const userEnrollments =
      await EnrollRepository.findActiveAndCompletedByUserId(userId);
    if (userEnrollments.length === 0) {
      return [];
    }

    const courseIds = userEnrollments.map((e) => e.courseId);
    const courseMap = await this.getCourseInBatch(courseIds);

    const richEnrollments = userEnrollments.map((enrollment) => {
      const courseDetails = courseMap.get(enrollment.courseId);

      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: parseFloat(enrollment.progressPercentage),
        lastAccessedAt: enrollment.lastAccessedAt,
        course: courseDetails || {
          id: enrollment.courseId,
          title: 'Course details not available',
        },
      };
    });

    await CacheService.set(cacheKey, richEnrollments);

    return richEnrollments;
  }

  private static calculateProgressPercentage(
    completedCount: number,
    totalCount: number
  ): string {
    if (totalCount === 0) {
      return '0.00';
    }

    const percentage = (completedCount / totalCount) * 100;

    return percentage.toFixed(2);
  }

  public static async markLessonAsComplete({
    userId,
    courseId,
    lessonId,
  }: MarkProgressData) {
    logger.info(
      `Marking lesson ${lessonId} as complete for uses ${userId} in course ${courseId}`
    );

    const enrollment = await EnrollRepository.findByUserAndCourse(
      userId,
      courseId
    );
    if (!enrollment) {
      throw new ForbiddenError();
    }

    const isLessonInCourse = enrollment.courseStructure.modules.some((module) =>
      module.lessonIds.includes(lessonId)
    );
    if (!isLessonInCourse) {
      throw new BadRequestError(
        `The specified lesson does not belong to this course. `
      );
    }

    const completedLessonsSet = new Set(enrollment.progress.completedLessons);
    if (completedLessonsSet.has(lessonId)) {
      logger.warn(
        `Lesson ${lessonId} is already complete for user ${userId}. No updated needed.`
      );

      return enrollment;
    }
    completedLessonsSet.add(lessonId);

    const newCompletedLessons = Array.from(completedLessonsSet);
    const newProgressPercentage = this.calculateProgressPercentage(
      newCompletedLessons.length,
      enrollment.courseStructure.totalLessons
    );

    const updatedEnrollment = await EnrollRepository.update(enrollment.id, {
      progress: { completedLessons: newCompletedLessons },
      progressPercentage: newProgressPercentage,
      lastAccessedAt: new Date(),
    });

    logger.info(
      `Progress updated for user ${userId}. New percentage: ${updatedEnrollment.progressPercentage}`
    );

    try {
      await AnalyticsRepository.createActivityLog({
        courseId: updatedEnrollment.courseId,
        userId: updatedEnrollment.userId,
        activityType: 'lesson_completion',
        metadata: { lessonId: lessonId },
        createdAt: new Date(),
      });

      logger.info(`Logged 'lesson_completion' activity for course ${courseId}`);
    } catch (error) {
      logger.error('Failed to log lesson completion activity', {
        enrollmentId: updatedEnrollment.id,
        error,
      });
    }

    const publisher = new StudentProgressUpdatePublisher();
    await publisher.publish({
      userId: updatedEnrollment.userId,
      courseId: updatedEnrollment.courseId,
      lessonId: lessonId,
      progressPercentage: parseFloat(updatedEnrollment.progressPercentage),
    });

    if (parseFloat(updatedEnrollment.progressPercentage) >= 100) {
      const completionPublisher = new StudentCourseCompletedPublisher();
      await completionPublisher.publish({
        userId: updatedEnrollment.userId,
        courseId: updatedEnrollment.courseId,
        enrollmentId: updatedEnrollment.id,
        completedAt: new Date(),
      });
    }

    await this.invalidateUserEnrollmentCache(userId);

    return updatedEnrollment;
  }

  // private static async getCourseManualEnrollment(
  //   courseId: string
  // ): Promise<CourseDetails & { instructorId: string }> {
  //   const courseServiceUrl = process.env.COURSE_SERVICE_URL;
  //   if (!courseServiceUrl) {
  //     throw new Error(`COURSE_SERVICE_URL is not defined.`);
  //   }

  //   try {
  //     const response = await axios.get<
  //       CourseDetails & { instructorId: string }
  //     >(`${courseServiceUrl}/api/courses/${courseId}`);

  //     return response.data;
  //   } catch (error) {
  //     if (isAxiosError(error) && error.response?.status === 404) {
  //       throw new NotFoundError('Course');
  //     }

  //     throw error;
  //   }
  // }

  public static async enrollUserManually({
    userId,
    courseId,
    requester,
  }: ManualEnrollmentData) {
    logger.info(
      `Manual enrollment request by ${requester.id} (${requester.role}) for user ${userId} in course ${courseId}`
    );

    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError(
        'Course not found or has not been synchronized yet.'
      );
    }

    if (
      requester.role === 'instructor' &&
      course.instructorId !== requester.id
    ) {
      throw new ForbiddenError();
    }

    const existingEnrollment = await EnrollRepository.findByUserAndCourse(
      userId,
      courseId
    );
    if (existingEnrollment) {
      throw new BadRequestError(`User is already enrolled in this course`);
    }

    const courseStructureData =
      await this.getCourseStructureForSnapshot(courseId);
    const courseStructure =
      this.createCourseStructureSnapshot(courseStructureData);

    const newEnrollment = await EnrollRepository.create({
      userId,
      courseId,
      courseStructure,
    });

    logger.info(
      `User ${userId} MANUAL enrolled in course ${courseId} by ${requester.id}`
    );

    const publisher = new UserEnrollmentPublisher();
    await publisher.publish({
      userId: newEnrollment.userId,
      courseId: newEnrollment.courseId,
      enrolledAt: newEnrollment.enrolledAt,
      enrollmentId: newEnrollment.id,
    });

    await this.invalidateUserEnrollmentCache(userId);

    return newEnrollment;
  }

  private static async changeEnrollmentStatus({
    enrollmentId,
    newStatus,
    requester,
  }: ChangeEnrollmentStatus) {
    logger.info(
      `Request by ${requester.id} to change enrollment ${enrollmentId} to status ${newStatus}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment');
    }

    const course = await CourseRepository.findById(enrollment.courseId);
    if (!course) {
      throw new NotFoundError(
        'Associated course not found or has not been synchronized yet.'
      );
    }

    if (
      requester.role === 'instructor' &&
      course.instructorId !== requester.id
    ) {
      throw new ForbiddenError();
    }

    const updated = await EnrollRepository.update(enrollmentId, {
      status: newStatus,
    });

    logger.info(
      `Enrollmen ${enrollmentId} status successfully changed to '${newStatus}' by ${requester.id}`
    );

    if (newStatus === 'suspended') {
      const publisher = new UserEnrollmentSuspendedPublisher();
      await publisher.publish({
        userId: updated.userId,
        courseId: updated.courseId,
        enrollmentId: updated.id,
        suspendedAt: updated.updatedAt,
      });
    } else if (newStatus === 'active') {
      const publiser = new UserEnrollmentReactivatedPublisher();
      await publiser.publish({
        userId: updated.userId,
        courseId: updated.courseId,
        enrollmentId: updated.id,
        reactivatedAt: updated.updatedAt,
      });
    }

    await this.invalidateUserEnrollmentCache(updated.userId);

    return updated;
  }

  public static async suspendEnrollment({
    enrollmentId,
    requester,
  }: UserEnrollmentStatus) {
    return this.changeEnrollmentStatus({
      enrollmentId,
      newStatus: 'suspended',
      requester,
    });
  }

  public static async reinstateEnrollment({
    enrollmentId,
    requester,
  }: UserEnrollmentStatus) {
    return this.changeEnrollmentStatus({
      enrollmentId,
      newStatus: 'active',
      requester,
    });
  }

  private static async getUserInBatch(
    userIds: string[]
  ): Promise<Map<string, PublicUserData>> {
    if (userIds.length === 0) {
      return new Map();
    }

    const userServiceUrl = process.env.USER_SERVICE_URL!;
    if (!userServiceUrl) {
      throw new Error(`USER_SERVICE_URL is not defined`);
    }

    try {
      const response = await axios.post<PublicUserData[]>(
        `${userServiceUrl}/api/users/bulk`,
        { userIds }
      );

      const userMap = new Map<string, PublicUserData>();
      for (const user of response.data) {
        userMap.set(user.userId, user);
      }

      return userMap;
    } catch (error) {
      let errorDetails: object = { message: (error as Error).message };
      if (isAxiosError(error)) {
        errorDetails = {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data,
        };
      }

      logger.error('Failed to batch fetch users from user-service: %o', {
        error: errorDetails,
      });

      return new Map();
    }
  }

  public static async getEnrollmentsByCourseId({
    courseId,
    requester,
    page,
    limit,
  }: GetEnrollmentsOptions) {
    logger.debug(
      `Fetching enrollments for course ${courseId} for requester ${requester.id}`
    );

    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError(
        'Course not found or has not been synchronized yet.'
      );
    }

    if (
      requester.role === 'instructor' &&
      course.instructorId !== requester.id
    ) {
      throw new ForbiddenError();
    }

    const offset = (page - 1) * limit;
    const whereClause = eq(enrollments.courseId, courseId);
    const totalEnrollmentQuery = await db
      .select({ value: count() })
      .from(enrollments)
      .where(whereClause);
    const paginatedEnrollmentsQuery = await db.query.enrollments.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
    });

    const [totalResult, paginatedEnrollments] = await Promise.all([
      totalEnrollmentQuery,
      paginatedEnrollmentsQuery,
    ]);

    const userIds = paginatedEnrollments.map((e) => e.userId);
    const userMap = await this.getUserInBatch(userIds);

    const richEnrollments = paginatedEnrollments.map((enrollment) => {
      const userProfile = userMap.get(enrollment.userId);

      return {
        enrollmentId: enrollment.id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: enrollment.progressPercentage,
        student: userProfile || {
          userId: enrollment.userId,
          firstName: 'User',
          lastName: 'Not Found',
        },
      };
    });

    const totalPages = Math.ceil(totalResult[0].value / limit);

    return {
      enrollments: richEnrollments,
      pagination: {
        currentPage: page,
        totalPages,
        totalResult: totalResult[0].value,
        limit,
      },
    };
  }

  public static async resetEnrollmentProgress({
    enrollmentId,
    requesterId,
  }: ResetProgressData) {
    logger.info(
      `User ${requesterId} is requesting to reset progress for enrollment ${enrollmentId}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment');
    }

    if (enrollment.userId !== requesterId) {
      throw new ForbiddenError();
    }

    const updatedEnrollments = await EnrollRepository.update(enrollmentId, {
      progress: { completedLessons: [] },
      progressPercentage: '0.00',
      status: 'active',
    });

    logger.info(`Successfully reset progress for enrollment ${enrollmentId}`);

    const publisher = new StudentProgressResetPublisher();
    await publisher.publish({
      userId: updatedEnrollments.userId,
      courseId: updatedEnrollments.courseId,
      enrollmentId: updatedEnrollments.id,
      resetAt: updatedEnrollments.updatedAt,
    });

    await this.invalidateUserEnrollmentCache(requesterId);

    return updatedEnrollments;
  }
}
