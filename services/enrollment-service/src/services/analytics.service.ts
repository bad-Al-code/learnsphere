import { AnalyticsRepository } from '../db/analytics.repository';

export class AnalyticsService {
  /**
   * @private
   * @static
   * @method calculatePercentageChange
   * @description Calculates the percentage change between a current value and a previous value.
   * If the previous value is 0 and the current value is greater than 0, returns 100%.
   * If both are 0, returns 0%.
   * @param {number} current - The current period value.
   * @param {number} previous - The previous period value.
   * @returns {number} The percentage change, rounded to the nearest integer.
   */
  private static calculatePercentageChange(
    current: number,
    previous: number
  ): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * @public
   * @static
   * @async
   * @method getInstructorAnalytics
   * @description Retrieves instructor analytics, including stats for total students and total revenue,
   * along with percentage changes and chart data by course.
   * @param {string} instructorId - The unique identifier for the instructor.
   * @returns {Promise<{
   *   stats: {
   *     totalStudents: { value: number; change: number };
   *     totalRevenue: { value: number; change: number };
   *   };
   *   chartData: any;
   * }>} A promise resolving to the instructor's analytics data.
   */
  public static async getInstructorAnalytics(instructorId: string) {
    const { currentPeriod, previousPeriod } =
      await AnalyticsRepository.getInstructorStats(instructorId);

    const prevStudents = previousPeriod.totalStudents ?? 0;
    const prevRevenue = previousPeriod.totalRevenue ?? 0;

    const studentChange = this.calculatePercentageChange(
      currentPeriod.totalStudents,
      prevStudents
    );
    const revenueChange = this.calculatePercentageChange(
      currentPeriod.totalRevenue,
      prevRevenue
    );

    return {
      stats: {
        totalStudents: {
          value: currentPeriod.totalStudents,
          change: studentChange,
        },
        totalRevenue: {
          value: currentPeriod.totalRevenue,
          change: revenueChange,
        },
      },
      chartData:
        await AnalyticsRepository.getStudentCountByCourse(instructorId),
    };
  }
}
