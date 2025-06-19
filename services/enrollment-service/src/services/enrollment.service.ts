import axios, { isAxiosError } from "axios";
import { inArray as drizzleArray, and, eq, count } from "drizzle-orm";

import logger from "../config/logger";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { db } from "../db";
import { enrollments } from "../db/schema";
import {
  ChangeEnrollmentStatus,
  CourseDetails,
  GetEnrollmentsOptions,
  ManualEnrollmentData,
  MarkProgressData,
  PublicCourseData,
  PublicUserData,
  UserEnrollmentData,
  UserEnrollmentStatus,
} from "../types";
import {
  Publisher,
  StudentCourseCompletedPublisher,
  StudentProgressUpdatePublisher,
  UserEnrollmentPublisher,
} from "../events/publisher";

export class EnrollmentService {
  private static async getValidCourseEnrollment(
    courseId: string
  ): Promise<CourseDetails> {
    const courseServiceUrl = process.env.COURSE_SERVICE_URL!;
    if (!courseServiceUrl) {
      throw new Error(`COURSE_SERVICE_URL is not defined`);
    }

    try {
      logger.debug(`Fetching user details for ${courseId} from course-service`);
      const response = await axios.get<CourseDetails>(
        `${courseServiceUrl}/api/courses/${courseId}`
      );
      if (response.data.status !== "published") {
        throw new BadRequestError("Enrollment Failed. Course is not published");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError("Course");
      }

      throw error;
    }
  }

  private static createCourseStructureSnapshot(course: CourseDetails) {
    let totalLessons = 0;
    let totalModules = course.modules.length;
    const moduleSnapshots = course.modules.map((module) => {
      const lessonIds = module.lessons.map((lesson) => lesson.id);
      totalLessons += lessonIds.length;
      return {
        id: module.id,
        lessonIds: lessonIds,
      };
    });

    return {
      totalModules: totalModules,
      totalLessons: totalLessons,
      modules: moduleSnapshots,
    };
  }

  public static async enrollUserInCourse({
    userId,
    courseId,
  }: UserEnrollmentData) {
    logger.info(`Attempting to enroll user ${userId} in course ${courseId}`);

    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });

    if (existingEnrollment) {
      throw new BadRequestError(`User is already enrolled in this course`);
    }

    const course = await this.getValidCourseEnrollment(courseId);
    const courseStructure = this.createCourseStructureSnapshot(course);

    if (courseStructure.totalLessons === 0) {
      throw new BadRequestError("Cannot enroll in a course with no lessons.");
    }

    const newEnrollment = (
      await db
        .insert(enrollments)
        .values({ userId, courseId, courseStructure })
        .returning()
    )[0];

    logger.info(`User ${userId} successfully enrolled in course ${courseId}`);

    const publiser = new UserEnrollmentPublisher();
    await publiser.publish({
      userId: newEnrollment.userId,
      courseId: newEnrollment.userId,
      enrolledAt: newEnrollment.enrolledAt,
      enrollmentId: newEnrollment.id,
    });

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
      let errorDetails: any = { message: (error as Error).message };
      if (isAxiosError(error)) {
        errorDetails = {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data,
        };
      }

      logger.error("Failed to batch fetch course from course-service: %o", {
        error: errorDetails,
      });

      return new Map();
    }
  }

  public static async getEnrollmentsByUserId(userId: string) {
    logger.debug(`Fetching all enrollments for user: ${userId}`);

    const userEnrollments = await db.query.enrollments.findMany({
      where: and(
        eq(enrollments.userId, userId),
        drizzleArray(enrollments.status, ["active", "completed"])
      ),
      orderBy: (enrollments, { desc }) => [desc(enrollments.lastAccessedAt)],
    });
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
          title: "Course details not available",
        },
      };
    });

    return richEnrollments;
  }

  private static calculateProgressPercentage(
    completedCount: number,
    totalCount: number
  ): string {
    if (totalCount === 0) {
      return "0.00";
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

    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });
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

    const updatedEnrollments = await db
      .update(enrollments)
      .set({
        progress: { completedLessons: newCompletedLessons },
        progressPercentage: newProgressPercentage,
        lastAccessedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(enrollments.id, enrollment.id))
      .returning();

    const updatedEnrollment = updatedEnrollments[0];

    logger.info(
      `Progress updated for user ${userId}. New percentage: ${updatedEnrollment.progressPercentage}`
    );

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

    return updatedEnrollment;
  }

  private static async getCourseManualEnrollment(
    courseId: string
  ): Promise<CourseDetails & { instructorId: string }> {
    const courseServiceUrl = process.env.COURSE_SERVICE_URL;
    if (!courseServiceUrl) {
      throw new Error(`COURSE_SERVICE_URL is not defined.`);
    }

    try {
      const response = await axios.get<
        CourseDetails & { instructorId: string }
      >(`${courseServiceUrl}/api/courses/${courseId}`);

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError("Course");
      }

      throw error;
    }
  }

  public static async enrollUserManually({
    userId,
    courseId,
    requester,
  }: ManualEnrollmentData) {
    logger.info(
      `Manual enrollment request by ${requester.id} (${requester.role}) for user ${userId} in course ${courseId}`
    );

    const course = await this.getCourseManualEnrollment(courseId);
    if (
      requester.role === "instructor" &&
      course.instructorId !== requester.id
    ) {
      throw new ForbiddenError();
    }

    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });
    if (existingEnrollment) {
      throw new BadRequestError(`User is already enrolled in this course`);
    }

    const courseStructure = this.createCourseStructureSnapshot(course);
    const newEnrollment = (
      await db
        .insert(enrollments)
        .values({ userId, courseId, courseStructure })
        .returning()
    )[0];

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

    const enrollment = await db.query.enrollments.findFirst({
      where: eq(enrollments.id, enrollmentId),
    });
    if (!enrollment) {
      throw new NotFoundError("Enrollment");
    }

    const course = await this.getCourseManualEnrollment(enrollment.courseId);
    if (
      requester.role === "instructor" &&
      course.instructorId !== requester.id
    ) {
      throw new ForbiddenError();
    }

    const updated = (
      await db
        .update(enrollments)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(enrollments.id, enrollmentId))
        .returning()
    )[0];

    logger.info(
      `Enrollmen ${enrollmentId} status successfully changed to '${newStatus}' by ${requester.id}`
    );

    // TODO: publish user.enrollment.suspended or user.enrollment.reactivated event

    return updated;
  }

  public static async suspendEnrollment({
    enrollmentId,
    requester,
  }: UserEnrollmentStatus) {
    return this.changeEnrollmentStatus({
      enrollmentId,
      newStatus: "suspended",
      requester,
    });
  }

  public static async reinstateEnrollment({
    enrollmentId,
    requester,
  }: UserEnrollmentStatus) {
    return this.changeEnrollmentStatus({
      enrollmentId,
      newStatus: "active",
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
      let errorDetails: any = { message: (error as Error).message };
      if (isAxiosError(error)) {
        errorDetails = {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data,
        };
      }

      logger.error("Failed to batch fetch users from user-service: %o", {
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

    const course = await this.getCourseManualEnrollment(courseId);
    if (
      requester.role === "instructor" &&
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
          firstName: "User",
          lastName: "Not Found",
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
}
