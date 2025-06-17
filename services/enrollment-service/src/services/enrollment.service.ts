import axios, { isAxiosError } from "axios";
import { BadRequestError, NotFoundError } from "../errors";
import { db } from "../db";
import { enrollments } from "../db/schema";
import logger from "../config/logger";
import { UserEnrollmentPublisher } from "../events/publisher";

interface EnrollmentData {
  courseId: string;
  userId: string;
  userEmail: string;
}

interface Course {
  id: string;
  status: "draft" | "published";
}

export class EnrollmentService {
  public static async createEnrollment(data: EnrollmentData) {
    const courseServiceUrl = process.env.COURSE_SERVICE_URL!;
    let course: Course;

    try {
      const response = await axios.get<Course>(
        `${courseServiceUrl}/api/courses/${data.courseId}`
      );
      course = response.data;
      if (course.status !== "published") {
        throw new BadRequestError(`You can only enroll in published courses.`);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError("Course");
      }

      throw error;
    }

    try {
      const newErollment = await db
        .insert(enrollments)
        .values({ courseId: data.courseId, userId: data.userId })
        .returning();

      logger.info(
        `User ${data.userId} successfully enrolled in course ${data.courseId}`
      );

      const publisher = new UserEnrollmentPublisher();
      publisher.publish({
        userId: data.userId,
        email: data.userEmail,
        courseId: data.courseId,
      });

      return newErollment[0];
    } catch (error: any) {
      if (error.code === "23505") {
        throw new BadRequestError("You are already enrolled in this course.");
      }

      throw error;
    }
  }
}
