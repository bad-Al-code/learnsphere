import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '.';
import { courses, enrollments } from './schema';

/**
 * @class AnalyticsRepository
 * @description Manages database operations for analytics-related queries.
 * This class provides static methods to aggregate and retrieve statistical data
 * from the database by performing complex queries.
 */
export class AnalyticsRepository {
  /**
   * @static
   * @async
   * @method getInstructorStats
   * @description Calculates key statistics for a specific instructor.
   * This method first finds all courses taught by the instructor. It then uses
   * the course IDs to calculate the total number of unique students enrolled
   * in those courses.
   * @param {string} instructorId - The unique identifier of the instructor.
   * @returns {Promise<{ totalStudents: number; totalRevenue: number }>} A promise that resolves to an object containing:
   * - `totalStudents`: The total number of unique students enrolled in the instructor's courses.
   * - `totalRevenue`: A placeholder for the total revenue, currently hardcoded to 0.
   */
  public static async getInstructorStats(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return { totalStudents: 0, totalRevenue: 0 };
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const totalStudentsResult = await db
      .select({
        count: sql<number>`count(distinct ${enrollments.userId})`,
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds));

    // NOTE: Placeholder for revenue calculation.
    const totalRevenue = 0;

    return {
      totalStudents: Number(totalStudentsResult[0].count),
      totalRevenue: totalRevenue,
    };
  }
}
