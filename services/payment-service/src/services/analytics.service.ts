import logger from '../config/logger';
import { AnalyticsRepository } from '../db/repostiories/analytics.repository';

export class AnalyticsService {
  /**
   * Retrieves the revenue breakdown for an instructor.
   * @param instructorId The ID of the instructor.
   * @returns An array of revenue sources for use in a pie chart.
   */
  public static async getRevenueBreakdown(instructorId: string) {
    const courseSalesRevenue =
      await AnalyticsRepository.getTotalRevenueByInstructor(instructorId);

    const breakdown = [
      { name: 'Course Sales', value: courseSalesRevenue },
      // NOTE: add other things here, PLEASE..................
    ];

    return breakdown.filter((item) => item.value > 0);
  }

  /**
   * Retrieves and formats monthly financial trends for an instructor.
   * @param instructorId The ID of the instructor.
   * @returns Formatted data ready for charting.
   */
  public static async getFinancialTrends(instructorId: string) {
    const monthlyData =
      await AnalyticsRepository.getMonthlyRevenueByInstructor(instructorId);

    return monthlyData.map((row) => ({
      month: `${row.month}`,
      revenue: parseFloat(row.revenue || '0'),
      // NOTE: Expenses and Profit are not tracked.
      expenses: 0,
      profit: parseFloat(row.revenue || '0'),
    }));
  }

  /**
   * Retrieves the total revenue for a single course.
   * @param courseId The ID of the course.
   */
  public static async getCourseRevenue(courseId: string) {
    logger.info(`Fetching total revenue for course ${courseId}`);
    const totalRevenue =
      await AnalyticsRepository.getTotalRevenueForCourse(courseId);
    return { totalRevenue };
  }
}
