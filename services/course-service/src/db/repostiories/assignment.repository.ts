import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  sql,
} from 'drizzle-orm';
import { db } from '..';
import {
  Assignment,
  FindAssignmentsQuery,
  NewAssignment,
  UpdateAssignmentDto,
} from '../../schemas';
import { assignments, assignmentSubmissions } from '../schema';

export class AssignmentRepository {
  /**
   * Creates a new assignment record in the database.
   * @param {NewAssignment} data - The data for the new assignment.
   * @returns {Promise<Assignment>} The newly created assignment.
   */
  public static async create(data: NewAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(data)
      .returning();

    return newAssignment;
  }

  /**
   * Finds an assignment by its unique identifier.
   * @param {string} id - The ID of the assignment to find.
   * @returns {Promise<Assignment | undefined>} The found assignment, or undefined if not found.
   */
  public static async findById(id: string): Promise<Assignment | undefined> {
    return db.query.assignments.findFirst({
      where: eq(assignments.id, id),
    });
  }

  /**
   * Updates an existing assignment by its ID.
   * @param {string} id - The ID of the assignment to update.
   * @param {Partial<UpdateAssignmentDto>} data - Partial data to update the assignment.
   * @returns {Promise<Assignment | null>} The updated assignment or null if not found.
   */
  public static async update(
    id: string,
    data: Partial<UpdateAssignmentDto>
  ): Promise<Assignment | null> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();

    return updatedAssignment || null;
  }

  /**
   * Deletes an assignment by its ID.
   * @param {string} id - The ID of the assignment to delete.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  public static async delete(id: string): Promise<void> {
    await db.delete(assignments).where(eq(assignments.id, id));
  }

  /**
   * Reorders multiple assignments within a module.
   * @param {Array<{ id: string; order: number }>} items - Array of assignments with new order values.
   * @param {string} moduleId - The module ID to which these assignments belong.
   * @returns {Promise<void>} Resolves when all reorder updates are complete.
   */
  public static async reorder(
    items: { id: string; order: number }[],
    moduleId: string
  ): Promise<void> {
    const queries = items.map((item) =>
      db
        .update(assignments)
        .set({ order: item.order })
        .where(
          and(eq(assignments.id, item.id), eq(assignments.moduleId, moduleId))
        )
    );

    await db.transaction(async (tx) => {
      await Promise.all(queries.map((q) => tx.execute(q)));
    });
  }

  /**
   * Finds and filters assignments with pagination.
   *
   * @param {FindAssignmentsQuery} options - Filtering and pagination options.
   * @param {string} options.courseId - Course UUID to filter assignments.
   * @param {string} [options.query] - Optional search query for assignment titles.
   * @param {'draft'|'published'} [options.status] - Optional assignment status filter.
   * @param {string} [options.moduleId] - Optional module UUID to filter assignments.
   * @param {number} options.page - Current page number.
   * @param {number} options.limit - Number of assignments per page.
   * @returns {Promise<{totalResults: number, results: Assignment[]}>} - Total count and filtered assignment list.
   */
  public static async findAndFilter({
    courseId,
    q: query,
    status,
    moduleId,
    page,
    limit,
  }: FindAssignmentsQuery) {
    const offset = (page - 1) * limit;

    const conditions = [eq(assignments.courseId, courseId)];
    if (query) {
      conditions.push(ilike(assignments.title, `%${query}%`));
    }
    if (status) {
      conditions.push(eq(assignments.status, status));
    }
    if (moduleId) {
      conditions.push(eq(assignments.moduleId, moduleId));
    }
    const whereClause = and(...conditions);

    const totalQuery = db
      .select({ value: count() })
      .from(assignments)
      .where(whereClause);

    const resultsQuery = db.query.assignments.findMany({
      where: whereClause,
      orderBy: [desc(assignments.createdAt)],
      limit,
      offset,
    });

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultsQuery,
    ]);

    return { totalResults, results };
  }

  /**
   * Retrieves status and stats for all assignments in a given course.
   * @param {string} courseId - The ID of the course.
   * @returns {Promise<any[]>} A promise that resolves to an array of assignment statuses.
   */
  public static async getAssignmentStatusForCourse(courseId: string) {
    const result = await db
      .select({
        assignmentId: assignments.id,
        title: assignments.title,
        dueDate: assignments.dueDate,
        totalSubmissions: count(assignmentSubmissions.id),
        averageGrade: avg(assignmentSubmissions.grade),
      })
      .from(assignments)
      .leftJoin(
        assignmentSubmissions,
        eq(assignments.id, assignmentSubmissions.assignmentId)
      )
      .where(eq(assignments.courseId, courseId))
      .groupBy(assignments.id)
      .orderBy(desc(assignments.dueDate))
      .limit(5);

    return result;
  }

  /**
   * Counts assignments that are due within the next 7 days for a given set of course IDs.
   * @param courseIds An array of course IDs.
   * @returns A promise that resolves to the count of due assignments.
   */
  public static async countDueSoonByCourseIds(
    courseIds: string[]
  ): Promise<number> {
    if (courseIds.length === 0) {
      return 0;
    }
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [result] = await db
      .select({ value: count() })
      .from(assignments)
      .where(
        and(
          inArray(assignments.courseId, courseIds),
          eq(assignments.status, 'published'),
          isNotNull(assignments.dueDate),
          gte(assignments.dueDate, now),
          lte(assignments.dueDate, sevenDaysFromNow)
        )
      );

    return result.value;
  }

  /**
   * Counts all published assignments for a user's enrolled courses that they have not yet submitted.
   * @param courseIds The user's enrolled course IDs.
   * @param userId The user's ID.
   * @returns The count of pending assignments.
   */
  public static async countPendingForUser(
    courseIds: string[],
    userId: string
  ): Promise<number> {
    if (courseIds.length === 0) return 0;

    const submittedAssignmentsSubquery = db
      .select({ assignmentId: assignmentSubmissions.assignmentId })
      .from(assignmentSubmissions)
      .where(
        and(
          eq(assignmentSubmissions.studentId, userId),
          inArray(assignmentSubmissions.courseId, courseIds)
        )
      );

    const [result] = await db
      .select({ value: count() })
      .from(assignments)
      .where(
        and(
          inArray(assignments.courseId, courseIds),
          eq(assignments.status, 'published'),
          sql`${assignments.id} NOT IN ${submittedAssignmentsSubquery}`
        )
      );

    return result.value;
  }

  /**
   * Find assignments that are pending for a specific user.
   * @param {string[]} courseIds - Array of course IDs to filter assignments by.
   * @param {string} userId - ID of the user for whom to find pending assignments.
   * @param {Object} options - Optional query filters.
   * @param {string} [options.query] - Optional search query to filter assignment titles.
   * @param {'not-started'|'in-progress'} [options.status] - Optional status filter (client-side concept; not enforced by backend).
   * @returns {Promise<Array>} - A promise that resolves to an array of pending assignments.
   */
  public static async findPendingForUser(
    courseIds: string[],
    userId: string,
    options: { query?: string; status?: 'draft' | 'published' }
  ) {
    if (courseIds.length === 0) return [];

    const submittedAssignmentsSubquery = db
      .select({ assignmentId: assignmentSubmissions.assignmentId })
      .from(assignmentSubmissions)
      .where(and(eq(assignmentSubmissions.studentId, userId)));

    const conditions = [
      inArray(assignments.courseId, courseIds),
      // eq(assignments.status, 'published'),
      sql`${assignments.id} NOT IN ${submittedAssignmentsSubquery}`,
    ];

    if (options.query) {
      conditions.push(ilike(assignments.title, `%${options.query}%`));
    }

    if (options.status) {
      conditions.push(eq(assignments.status, options.status));
    }

    return db.query.assignments.findMany({
      where: and(...conditions),
      orderBy: [desc(assignments.dueDate)],
    });
  }
}
