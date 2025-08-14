import {
  and,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  lt,
  sql,
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
   * 1. Finds all courses taught by the instructor.
   * 2. Counts the number of unique students enrolled in those courses during:
   *    - The current period (last 30 days)
   *    - The previous period (30–60 days ago)
   * 3. Estimates total revenue for each period using a placeholder `revenuePerStudent` value.
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
   * }>} A promise that resolves to an object containing statistics for both periods:
   * - `totalStudents`: The number of unique students in the period.
   * - `totalRevenue`: Estimated revenue for the period.
   */
  public static async getInstructorStats(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return {
        currentPeriod: { totalStudents: 0, totalRevenue: 0 },
        previousPeriod: { totlaStudents: 0, totalRevenue: 0 },
      };
    }

    const courseIds = instructorCourses.map((c) => c.id);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriodStats = await db
      .select({
        count: sql<number>`count(distinct ${enrollments.userId})`,
      })
      .from(enrollments)
      .where(
        and(
          inArray(enrollments.courseId, courseIds),
          gte(enrollments.enrolledAt, thirtyDaysAgo)
        )
      );

    const previousPeriodStats = await db
      .select({
        count: sql<number>`count(distinct ${enrollments.userId})`,
      })
      .from(enrollments)
      .where(
        and(
          inArray(enrollments.courseId, courseIds),
          gte(enrollments.enrolledAt, sixtyDaysAgo),
          lt(enrollments.enrolledAt, thirtyDaysAgo)
        )
      );

    const revenuePerStudent = 500; //NOTE: Placeholder value

    return {
      currentPeriod: {
        totalStudents: Number(currentPeriodStats[0]?.count || 0),
        totalRevenue:
          Number(currentPeriodStats[0]?.count || 0) * revenuePerStudent,
      },
      previousPeriod: {
        totalStudents: Number(previousPeriodStats[0]?.count || 0),
        totalRevenue:
          Number(previousPeriodStats[0]?.count || 0) * revenuePerStudent,
      },
    };
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
}
