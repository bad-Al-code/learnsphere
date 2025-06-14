import { eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../errors";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}
export class CourseService {
  public static async createCourse(data: CreateCourseData) {
    logger.info(`Creating a new course`, {
      title: data.title,
      instructorId: data.instructorId,
    });

    const newCourse = await db
      .insert(courses)
      .values({
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
      })
      .returning();

    return newCourse[0];
  }

  public static async getAllCourses(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const allCourses = await db.query.courses.findMany({
      limit,
      offset,
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return allCourses;
  }

  public static async getCourseById(courseId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    return course;
  }

  public static async updateCourse(
    courseId: string,
    data: Partial<CreateCourseData>,
    userId: string,
    userRole: string
  ) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      columns: { instructorId: true },
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    if (userRole !== "admin" && course.instructorId !== userId) {
      throw new ForbiddenError();
    }

    logger.info(`Updating course ${courseId} by user ${userId}`);

    const updatedCourse = await db
      .update(courses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse[0];
  }
}
