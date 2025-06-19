import axios, { isAxiosError } from "axios";
import { and, eq } from "drizzle-orm";

import logger from "../config/logger";
import { BadRequestError, NotFoundError } from "../errors";
import { db } from "../db";
import { enrollments } from "../db/schema";
import { CourseDetails, PublicCourseData, UserEnrollmentData } from "../types";

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

    const newEnrollment = await db
      .insert(enrollments)
      .values({ userId, courseId, courseStructure })
      .returning();

    logger.info(`User ${userId} successfully enrolled in course ${courseId}`);
    // TODO: publish a `user.enrolled` event

    return newEnrollment[0];
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
      where: eq(enrollments.userId, userId),
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
}
