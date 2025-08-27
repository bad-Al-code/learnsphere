import { and, eq, gte, sql, sum } from 'drizzle-orm';
import { db } from '..';
import { courses, payments } from '../schema';

export class AnalyticsRepository {
  /**
   * Calculates the total revenue from completed course sales for a specific instructor.
   * @param instructorId The ID of the instructor.
   * @returns The total revenue as a number.
   */
  public static async getTotalRevenueByInstructor(
    instructorId: string
  ): Promise<number> {
    const [result] = await db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(courses, eq(payments.courseId, courses.id))
      .where(
        and(
          eq(courses.instructorId, instructorId),
          eq(payments.status, 'completed')
        )
      );

    return parseFloat(result?.total || '0');
  }

  /**
   * Retrieves monthly revenue for an instructor over the last 6 months.
   * @param instructorId The ID of the instructor.
   * @returns An array of objects, each containing the month and total revenue.
   */
  public static async getMonthlyRevenueByInstructor(instructorId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(date_trunc('month', ${payments.createdAt}), 'Mon')`,
        year: sql<string>`EXTRACT(YEAR FROM date_trunc('month', ${payments.createdAt}))`,
        revenue: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(courses, eq(payments.courseId, courses.id))
      .where(
        and(
          eq(courses.instructorId, instructorId),
          eq(payments.status, 'completed'),
          gte(payments.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`date_trunc('month', ${payments.createdAt})`)
      .orderBy(sql`date_trunc('month', ${payments.createdAt})`);

    return result;
  }

  /**
   * Calculates the total revenue for a single course.
   * @param courseId The ID of the course.
   * @returns The total revenue as a number.
   */
  public static async getTotalRevenueForCourse(
    courseId: string
  ): Promise<number> {
    const [result] = await db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .where(
        and(eq(payments.courseId, courseId), eq(payments.status, 'completed'))
      );

    return parseFloat(result?.total || '0');
  }
}
