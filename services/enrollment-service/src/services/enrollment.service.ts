import axios, { isAxiosError } from "axios";
import { and, eq } from "drizzle-orm";

import logger from "../config/logger";
import { BadRequestError, NotFoundError } from "../errors";
import { db } from "../db";
import { enrollments } from "../db/schema";

interface CourseDetails {
  id: string;
  status: "draft" | "published";
  modules: {
    id: string;
    lessons: {
      id: string;
    }[];
  }[];
}

interface UserEnrollmentData {
  userId: string;
  courseId: string;
}

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
}
