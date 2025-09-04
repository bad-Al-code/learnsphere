import { and, eq, gte, lt, sql, sum } from 'drizzle-orm';
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

  /**
   * Calculates revenue for a course over two periods: the last 30 days and the 30 days prior.
   * @param courseId The ID of the course.
   * @returns An object containing revenue for the current and previous periods.
   */
  public static async getRevenueTrendForCourse(courseId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const revenueLast30DaysQuery = db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(
        and(
          eq(payments.courseId, courseId),
          eq(payments.status, 'completed'),
          gte(payments.createdAt, thirtyDaysAgo)
        )
      );

    const revenuePrevious30DaysQuery = db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(
        and(
          eq(payments.courseId, courseId),
          eq(payments.status, 'completed'),
          gte(payments.createdAt, sixtyDaysAgo),
          lt(payments.createdAt, thirtyDaysAgo)
        )
      );

    const [[currentPeriod], [previousPeriod]] = await Promise.all([
      revenueLast30DaysQuery,
      revenuePrevious30DaysQuery,
    ]);

    return {
      currentPeriodRevenue: parseFloat(currentPeriod?.total || '0'),
      previousPeriodRevenue: parseFloat(previousPeriod?.total || '0'),
    };
  }

  /**
   * Calculates total revenue for an instructor over the last two 30-day periods.
   * @param instructorId The ID of the instructor.
   * @returns An object with revenue for the current and previous periods.
   */
  public static async getOverallRevenueTrend(instructorId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [currentPeriod] = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .innerJoin(courses, eq(payments.courseId, courses.id))
      .where(
        and(
          eq(courses.instructorId, instructorId),
          eq(payments.status, 'completed'),
          gte(payments.createdAt, thirtyDaysAgo)
        )
      );

    const [previousPeriod] = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .innerJoin(courses, eq(payments.courseId, courses.id))
      .where(
        and(
          eq(courses.instructorId, instructorId),
          eq(payments.status, 'completed'),
          gte(payments.createdAt, sixtyDaysAgo),
          lt(payments.createdAt, thirtyDaysAgo)
        )
      );

    return {
      currentPeriodRevenue: parseFloat(currentPeriod?.total || '0'),
      previousPeriodRevenue: parseFloat(previousPeriod?.total || '0'),
    };
  }
}
