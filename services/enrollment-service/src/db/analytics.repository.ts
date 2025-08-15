import {
  and,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  lt,
  sql,
  sum,
} from 'drizzle-orm';
import { db } from '.';
import { courses, enrollments } from './schema';

export class AnalyticsRepository {
  /**
   * @static
   * @async
   * @method getInstructorStats
   * @description Calculates enrollment and revenue statistics for the given instructor
   * for both the current and previous 30-day periods.
   *
   * This method:
   * 1. Retrieves all courses taught by the specified instructor.
   * 2. Uses those course IDs to query the enrollments table and calculate:
   *    - The total number of unique students enrolled.
   *    - The total revenue earned (based on `coursePriceAtEnrollment`).
   * 3. Calculates these metrics for:
   *    - **Current period**: enrollments within the last 30 days.
   *    - **Previous period**: enrollments between 30 and 60 days ago.
   *
   * @param {string} instructorId - The unique identifier of the instructor.
   * @returns {Promise<{
   *   currentPeriod: {
   *     totalStudents: number;
   *     totalRevenue: number;
   *   };
   *   previousPeriod: {
   *     totalStudents: number;
   *     totalRevenue: number;
   *   };
   * }>} A promise resolving to an object containing statistics for both time periods:
   * - `totalStudents`: The count of unique students for the period.
   * - `totalRevenue`: The total revenue earned during the period.
   *
   * @throws {Error} If database queries fail or `instructorId` is invalid.
   */

  public static async getInstructorStats(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return {
        currentPeriod: { totalStudents: 0, totalRevenue: 0 },
        previousPeriod: { totalStudents: 0, totalRevenue: 0 },
      };
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const calculateStatsForPeriod = async (start: Date, end?: Date) => {
      const conditions = [
        inArray(enrollments.courseId, courseIds),
        gte(enrollments.enrolledAt, start),
      ];
      if (end) {
        conditions.push(lt(enrollments.enrolledAt, end));
      }

      const [stats] = await db
        .select({
          totalStudents: countDistinct(enrollments.userId),
          totalRevenue: sum(enrollments.coursePriceAtEnrollment),
        })
        .from(enrollments)
        .where(and(...conditions));

      return {
        totalStudents: stats.totalStudents || 0,
        totalRevenue: parseFloat(stats.totalRevenue || '0'),
      };
    };

    const currentPeriod = await calculateStatsForPeriod(thirtyDaysAgo);
    const previousPeriod = await calculateStatsForPeriod(
      sixtyDaysAgo,
      thirtyDaysAgo
    );

    return { currentPeriod, previousPeriod };
  }

  /**
   * Gets the number of unique students for each of an instructor's courses.
   * @param instructorId The ID of the instructor.
   * @returns An array of objects with courseId and studentCount.
   */
  public static async getStudentCountByCourse(instructorId: string) {
    const instructorCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];

    const courseIds = instructorCourses.map((c) => c.id);

    return db
      .select({
        courseId: enrollments.courseId,
        studentCount: countDistinct(enrollments.userId),
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds))
      .groupBy(enrollments.courseId)
      .orderBy(desc(sql`count(distinct ${enrollments.userId})`));
  }

  /**
   * Retrieves monthly enrollment counts and revenue for an instructor over the last 6 months.
   * @param instructorId The ID of the instructor
   * @returns An array of objects, each containing the month, total enrollments, and total revenue.
   */
  public static async getMonthlyEnrollmentAndRevenue(instructorId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return [];
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(date_trunc('month', ${enrollments.enrolledAt}), 'Mon')`,
        year: sql<string>`EXTRACT(YEAR FROM date_trunc('month', ${enrollments.enrolledAt}))`,
        revenue: sum(enrollments.coursePriceAtEnrollment),
        enrollments: countDistinct(enrollments.id),
      })
      .from(enrollments)
      .where(
        and(
          inArray(enrollments.courseId, courseIds),
          gte(enrollments.enrolledAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`date_trunc('month', ${enrollments.enrolledAt})`)
      .orderBy(sql`date_trunc('month', ${enrollments.enrolledAt})`);

    return result;
  }

  /**
   * Calculates the average completion percentage for a given list of course IDs.
   * @param courseIds - An array of course IDs.
   * @returns A promise that resolves to an array of objects, each containing a courseId and its average completion rate.
   */
  public static async getAverageCompletionByCourse(courseIds: string[]) {
    if (courseIds.length === 0) {
      return [];
    }

    const result = await db
      .select({
        courseId: enrollments.courseId,
        averageCompletion:
          sql<number>`AVG(${enrollments.progressPercentage})`.as(
            'average_completion'
          ),
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds))
      .groupBy(enrollments.courseId);

    return result.map((item) => ({
      ...item,
      averageCompletion: parseFloat(item.averageCompletion?.toString() || '0'),
    }));
  }
}
