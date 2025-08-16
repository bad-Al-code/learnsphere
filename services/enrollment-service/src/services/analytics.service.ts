import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';
import { AnalyticsRepository } from '../db/analytics.repository';
import { CourseRepository } from '../db/course.repository';
import { UserProfileData } from '../types';

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

  /**
   * Gets and formats the monthly enrollment and revenue trends for an instructor.
   * @param instructorId The ID of the instructor.
   * @returns A formatted array of trend data.
   */
  public static async getInstructorTrends(instructorId: string) {
    const monthlyData =
      await AnalyticsRepository.getMonthlyEnrollmentAndRevenue(instructorId);

    return monthlyData.map((row) => ({
      month: `${row.month}`,
      revenue: parseFloat(row.revenue || '0'),
      enrollments: row.enrollments,
    }));
  }

  public static async getInstructorCoursePerformance(instructorId: string) {
    const instructorCourses =
      await CourseRepository.findAllByInstructorId(instructorId);

    if (instructorCourses.length === 0) {
      return [];
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const performanceData =
      await AnalyticsRepository.getAverageCompletionByCourse(courseIds);

    return performanceData;
  }

  /**
   * Calculates demographic and device usage statistics for an instructor's students.
   * @param instructorId The ID of the instructor.
   */
  public static async getDemographicAndDeviceStats(instructorId: string) {
    const studentIds =
      await AnalyticsRepository.getStudentIdsForInstructor(instructorId);

    if (studentIds.length === 0) {
      return { demographics: [], deviceUsage: [] };
    }

    const response = await axios.post<UserProfileData[]>(
      `${env.USER_SERVICE_URL}/api/users/bulk`,
      { userIds: studentIds }
    );
    logger.info('pro:', response);
    const profiles = response.data;

    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46+': 0,
      Unknown: 0,
    };
    profiles.forEach((p) => {
      if (p.dateOfBirth) {
        const age =
          new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
        if (age >= 18 && age <= 25) ageGroups['18-25']++;
        else if (age >= 26 && age <= 35) ageGroups['26-35']++;
        else if (age >= 36 && age <= 45) ageGroups['36-45']++;
        else if (age >= 46) ageGroups['46+']++;
        else ageGroups.Unknown++;
      } else {
        ageGroups.Unknown++;
      }
    });

    const demographics = [
      { name: '18-25', value: ageGroups['18-25'], fill: 'hsl(var(--chart-1))' },
      { name: '26-35', value: ageGroups['26-35'], fill: 'hsl(var(--chart-2))' },
      { name: '36-45', value: ageGroups['36-45'], fill: 'hsl(var(--chart-3))' },
      { name: '46+', value: ageGroups['46+'], fill: 'hsl(var(--chart-4))' },
    ].filter((g) => g.value > 0);

    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 };
    profiles.forEach((p) => {
      const device = p.lastKnownDevice || 'unknown';
      if (device in deviceCounts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (deviceCounts as any)[device]++;
      } else {
        deviceCounts.unknown++;
      }
    });

    const totalDevices = profiles.length;
    logger.info('total:', totalDevices);
    const deviceUsage = [
      {
        name: 'Desktop' as const,
        users: deviceCounts.desktop,
        percentage:
          totalDevices > 0
            ? Math.round((deviceCounts.desktop / totalDevices) * 100)
            : 0,
      },
      {
        name: 'Mobile' as const,
        users: deviceCounts.mobile,
        percentage:
          totalDevices > 0
            ? Math.round((deviceCounts.mobile / totalDevices) * 100)
            : 0,
      },
      {
        name: 'Tablet' as const,
        users: deviceCounts.tablet,
        percentage:
          totalDevices > 0
            ? Math.round((deviceCounts.tablet / totalDevices) * 100)
            : 0,
      },
    ].filter((d) => d.users > 0);

    return { demographics, deviceUsage };
  }

  /**
   * @async
   * @description Retrieves the top performing students for a givem instructor
   * @param instructorId The UUID of the instructor
   * @returns {Promise<any>} A promise the resolves with the top students data
   */
  public static async getTopStudents(instructorId: string) {
    const result =
      await AnalyticsRepository.getTopStudentsForInstructor(instructorId);

    return result;
  }
}
