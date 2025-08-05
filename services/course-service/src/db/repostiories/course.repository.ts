import { and, count, eq, ilike, inArray } from 'drizzle-orm';

import { db } from '..';
import { Course, NewCourse, UpdateCourse } from '../../types';
import { courses } from '../schema';

export class CourseRepository {
  /**
   * Creates a new course.
   * @param data - The data for the new course.
   * @returns The newly created course object.
   */
  public static async create(data: NewCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(data).returning();

    return newCourse;
  }

  /**
   * Finds a single course by its ID, without any relations.
   * @param courseId - The ID of the course to find.
   * @returns A course object or undefined if not found.
   */
  public static async findById(courseId: string): Promise<Course | undefined> {
    return db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
  }

  /**
   * Finds a single course and all its related modules and lessons.
   * @param courseId - The ID of the course to find.
   * @returns The full course object with nested relations, or undefined if not found.
   */
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

  /**
   * Finds multiple courses by an array of IDs.
   * @param courseIds - An array of course IDs.
   * @returns An array of course objects.
   */
  public static async findManyIds(courseIds: string[]): Promise<Course[]> {
    if (courseIds.length === 0) return [];

    return db.query.courses.findMany({
      where: inArray(courses.id, courseIds),
    });
  }

  /**
   * Lists all published courses with pagination.
   * @param limit - The number of results per page.
   * @param offset - The number of results to skip.
   * @returns An object containing the paginated results and the total count.
   */
  public static async listPublished(
    limit: number,
    offset: number,
    categoryId?: string
  ) {
    const conditions = [eq(courses.status, 'published')];
    if (categoryId) {
      conditions.push(eq(courses.categoryId, categoryId));
    }

    const whereClause = and(...conditions);

    const totalQuery = db
      .select({ value: count() })
      .from(courses)
      .where(whereClause);

    const resultQuery = db.query.courses.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultQuery,
    ]);

    return { totalResults, results };
  }

  /**
   * Updates a course's data.
   * @param courseId - The ID of the course to update.
   * @param data - An object with the fields to update.
   * @returns The updated course object.
   */
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

  /**
   * Updates a course's status to 'draft' or 'published'.
   * @param courseId - The ID of the course to update.
   * @param status - The new status.
   * @returns The updated course object.
   */
  public static async updateStatus(
    courseId: string,
    status: 'draft' | 'published'
  ): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ status, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse;
  }

  /**
   * Deletes a course by its ID.
   * @param courseId - The ID of the course to delete.
   */
  public static async delete(courseId: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, courseId));
  }

  /**
   * Retrieves the total number of courses in the database.
   * @returns {Promise<number>} The total count of courses.
   */
  public static async getTotalCount(): Promise<number> {
    const [{ value }] = await db.select({ value: count() }).from(courses);
    return value;
  }

  /**
   * Searches all courses by title with optional pagination.
   *
   * Performs a case-insensitive search on course titles and returns paginated results
   * along with the total number of matched records.
   *
   * @param {string} query - The search term to filter course titles (optional).
   * @param {number} limit - The maximum number of results to return.
   * @param {number} offset - The number of results to skip for pagination.
   * @returns {Promise<{ totalResults: number; results: any[] }>}
   * An object containing the total count of matching courses and the result set.
   */ public static async searchAll(
    query: string,
    limit: number,
    offset: number
  ) {
    const whereClause = query ? ilike(courses.title, `%${query}%`) : undefined;

    const totalQuery = db
      .select({ value: count() })
      .from(courses)
      .where(whereClause);
    const resultQuery = db.query.courses.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultQuery,
    ]);

    return { totalResults, results };
  }
}
