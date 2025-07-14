import { count, eq, inArray } from "drizzle-orm";

import { db } from ".";
import { Course, NewCourse, UpdateCourse } from "../types";
import { courses } from "./schema";

export class CourseRepository {
  public static async create(data: NewCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(data).returning();

    return newCourse;
  }

  public static async findById(courseId: string): Promise<Course | undefined> {
    return db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
  }

  public static async findByIdWithRelations(courseId: string) {
    return db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
              with: {
                textContent: true,
              },
            },
          },
        },
      },
    });
  }

  public static async findManyIds(courseIds: string[]): Promise<Course[]> {
    if (courseIds.length === 0) return [];

    return db.query.courses.findMany({
      where: inArray(courses.id, courseIds),
    });
  }

  public static async listPublished(limit: number, offset: number) {
    const whereClause = eq(courses.status, "published");
    const totalQuery = db
      .select({ value: count() })
      .from(courses)
      .where(whereClause);

    const resultQuery = db.query.courses.findMany({
      where: whereClause,
      limit,
      offset,
    });

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultQuery,
    ]);

    return { totalResults, results };
  }

  public static async update(
    courseId: string,
    data: UpdateCourse
  ): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse;
  }

  public static async updateStatus(
    courseId: string,
    status: "draft" | "published"
  ): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ status, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse;
  }

  public static async delete(courseId: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, courseId));
  }
}
