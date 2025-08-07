import { and, count, desc, eq, ilike, inArray, sql } from 'drizzle-orm';

import { db } from '..';
import { GetCoursesByInstructorOptions } from '../../schemas';
import { Course, CourseLevel, NewCourse, UpdateCourse } from '../../types';
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
   * @param categoryId The Id of the category.
   * @param level Level of the course.
   * @returns An object containing the paginated results and the total count.
   */
  public static async listPublished(
    limit: number,
    offset: number,
    categoryId?: string,
    level?: CourseLevel
  ) {
    const conditions = [eq(courses.status, 'published')];
    if (categoryId) {
      conditions.push(eq(courses.categoryId, categoryId));
    }
    if (level) {
      conditions.push(eq(courses.level, level));
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

  /**
   * Finds published courses by title for the public search command.
   * @param query The search term
   * @param limit The maximumn number of results to return
   * @returns An array of simplified course objects
   */
  public static async findPublishedByTitle(
    query: string,
    limit: number = 5
  ): Promise<{ id: string; title: string }[]> {
    if (!query) return [];

    return db
      .select({ id: courses.id, title: courses.title })
      .from(courses)
      .where(
        and(eq(courses.status, 'published'), ilike(courses.title, `%${query}%`))
      )
      .orderBy(desc(courses.createdAt))
      .limit(limit);
  }

  /**
   * @static
   * @async
   * @method findAllByInstructorId
   * @description Finds all courses in the database created by a specific instructor.
   * The results are ordered by the creation date in descending order, showing the
   * newest courses first.
   * @param {string} instructorId - The unique identifier of the instructor whose courses are to be retrieved.
   * @returns {Promise<Course[]>} A promise that resolves with an array of `Course` objects.
   * If no courses are found for the instructor, it returns an empty array.
   */
  public static async findAllByInstructorId(
    instructorId: string
  ): Promise<Course[]> {
    return db.query.courses.findMany({
      where: eq(courses.instructorId, instructorId),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });
  }

  /**
   * @static
   * @async
   * @method findAndFilterByInstructorId
   * @description Finds, filters, sorts, and paginates courses for a specific instructor.
   * This method constructs a dynamic SQL query based on a variety of filter
   * criteria. It performs two queries in parallel: one to get the total count
   * of matching records for pagination metadata, and another to fetch the
   * actual data for the requested page.
   *
   * @param {GetCoursesByInstructorOptions} options - The options object for filtering and pagination.
   * @param {string} options.instructorId - The UUID of the instructor to fetch courses for.
   * @param {string} [options.query] - A search term to match against course titles (case-insensitive).
   * @param {string} [options.categoryId] - The UUID of a category to filter by.
   * @param {CourseLevel} [options.level] - The difficulty level to filter by.
   * @param {'free' | 'paid'} [options.price] - Filter by free or paid courses.
   * @param {string} [options.duration] - A duration range (in minutes/hours) to filter by, e.g., "60-120" or "180".
   * @param {'newest' | 'rating' | 'popularity'} [options.sortBy='newest'] - The sorting criteria. Defaults to 'newest'.
   * @param {number} options.page - The page number for pagination (starts at 1).
   * @param {number} options.limit - The number of results to return per page.
   *
   * @returns {Promise<{totalResults: number, results: Course[]}>} A promise that resolves to an object containing:
   * - `totalResults`: The total number of courses matching the filter criteria (ignoring pagination).
   * - `results`: An array of course objects for the specified page.
   */
  public static async findAndFilterByInstructorId({
    instructorId,
    query,
    categoryId,
    level,
    price,
    duration,
    sortBy = 'newest',
    page,
    limit,
  }: GetCoursesByInstructorOptions) {
    const offset = (page - 1) * limit;

    const conditions = [eq(courses.instructorId, instructorId)];
    if (query) {
      conditions.push(ilike(courses.title, `%${query}%`));
    }
    if (categoryId) {
      conditions.push(eq(courses.categoryId, categoryId));
    }
    if (level) {
      conditions.push(eq(courses.level, level));
    }
    if (price === 'free') {
      conditions.push(eq(courses.price, '0'));
    }
    if (price === 'paid') {
      conditions.push(sql`${courses.price} > 0`);
    }
    if (duration) {
      const [min, max] = duration.split('-').map(Number);

      if (max) {
        conditions.push(
          sql`${courses.duration} >= ${min} AND ${courses.duration} <= ${max}`
        );
      } else {
        conditions.push(sql`${courses.duration} >= ${min}`);
      }
    }

    const whereClause = and(...conditions);

    let orderByClause;

    switch (sortBy) {
      case 'rating':
        orderByClause = [desc(courses.averageRating)];
        break;
      case 'popularity':
        orderByClause = [desc(courses.enrollmentCount)];
        break;
      case 'newest':
      default:
        orderByClause = [desc(courses.createdAt)];
    }

    const totalQuery = db
      .select({ value: count() })
      .from(courses)
      .where(whereClause);
    const resultQuery = db.query.courses.findMany({
      where: whereClause,
      orderBy: orderByClause,
      limit,
      offset,
    });

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultQuery,
    ]);

    return { totalResults, results };
  }
}
