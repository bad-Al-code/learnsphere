import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import logger from '../config/logger';
import { CourseRepository, StudentGradeRepository } from '../db/repositories';
import { AnalyticsRepository } from '../db/repositories/analytics.repository';
import { BadRequestError } from '../errors';
import { ReportGenerationRequestedPublisher } from '../events/publisher';
import { StudentPerformance, UserProfileData } from '../types';

interface ModuleDetails {
  id: string;
  title: string;
}

interface CourseDetails {
  id: string;
  title: string;
}

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
   * Fetches user profiles in bulk from the user-service.
   */
  private static async fetchUserProfiles(
    userIds: string[]
  ): Promise<Map<string, UserProfileData>> {
    const userMap = new Map<string, UserProfileData>();
    if (userIds.length === 0) return userMap;

    try {
      const response = await axios.post<UserProfileData[]>(
        `${env.USER_SERVICE_URL}/api/users/bulk`,
        { userIds }
      );
      for (const profile of response.data) {
        userMap.set(profile.userId, profile);
      }
    } catch (error) {
      logger.error('Failed to fetch user profiles from user-service', {
        error,
      });
    }
    return userMap;
  }

  /**
   * Fetches course details in bulk from the course-service.
   */
  private static async fetchCourseDetails(
    courseIds: string[]
  ): Promise<Map<string, CourseDetails>> {
    const courseMap = new Map<string, CourseDetails>();
    if (courseIds.length === 0) return courseMap;

    try {
      const response = await axios.post<CourseDetails[]>(
        `${env.COURSE_SERVICE_URL}/api/courses/bulk`,
        { courseIds }
      );
      for (const course of response.data) {
        courseMap.set(course.id, course);
      }
    } catch (error) {
      logger.error('Failed to fetch course details from course-service', {
        error,
      });
    }
    return courseMap;
  }

  /**
   * Fetches module details in bulk from the course-service.
   */
  private static async fetchModuleDetails(
    moduleIds: string[]
  ): Promise<Map<string, string>> {
    const moduleMap = new Map<string, string>();
    if (moduleIds.length === 0) return moduleMap;

    try {
      const response = await axios.post<ModuleDetails[]>(
        `${env.COURSE_SERVICE_URL}/api/modules/bulk`,
        { moduleIds }
      );
      for (const module of response.data) {
        moduleMap.set(module.id, module.title);
      }
    } catch (error) {
      logger.error('Failed to fetch module details from course-service', {
        error,
      });
    }
    return moduleMap;
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
      avgScore: row.avgScore ?? 0,
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
      { name: '18-25', value: ageGroups['18-25'], fill: 'var(--chart-1)' },
      { name: '26-35', value: ageGroups['26-35'], fill: 'var(--chart-2)' },
      { name: '36-45', value: ageGroups['36-45'], fill: 'var(--chart-3)' },
      { name: '46+', value: ageGroups['46+'], fill: 'var(--chart-4)' },
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
    const topEnrollments =
      await AnalyticsRepository.getTopStudentsForInstructor(instructorId);
    if (topEnrollments.length === 0) return [];

    const studentIds = topEnrollments.map((e) => e.userId);
    const courseIds = [...new Set(topEnrollments.map((e) => e.courseId))];

    const [userProfiles, courseDetails] = await Promise.all([
      this.fetchUserProfiles(studentIds),
      this.fetchCourseDetails(courseIds),
    ]);

    return topEnrollments.map((enrollment) => {
      const student = userProfiles.get(enrollment.userId);
      const course = courseDetails.get(enrollment.courseId);
      return {
        ...enrollment,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : 'Unknown User',
        courseTitle: course ? course.title : 'Unknown Course',
        progress: parseFloat(enrollment.progress),
      };
    });
  }

  /**
   * @async
   * @description Gets and formats the module progress distribution for an instructor.
   * @param {string} instructorId - The UUID of the instructor.
   * @returns {Promise<any>} A promise that resolves with the formatted chart data.
   */
  public static async getModuleProgress(instructorId: string) {
    const progressData =
      await AnalyticsRepository.getModuleProgressForInstructor(instructorId);

    if (progressData.length === 0) {
      return [];
    }

    const moduleIds = progressData.map((p) => p.module_id);
    const moduleDetailsMap = await this.fetchModuleDetails(moduleIds);

    return progressData.map((p) => ({
      name: moduleDetailsMap.get(p.module_id) || 'Unknown Module',
      completed: p.completed,
      inProgress: p.inProgress,
      notStarted: p.notStarted,
    }));
  }

  /**
   * @async
   * @description Gets and formats the weekly engagement patterns for an instructor.
   * @param {string} instructorId - The UUID of the instructor.
   * @returns {Promise<any>} Formatted data for the weekly engagement chart.
   */
  public static async getWeeklyEngagement(instructorId: string) {
    const weeklyData =
      await AnalyticsRepository.getWeeklyActivity(instructorId);

    return weeklyData.map((row) => ({
      name: new Date(row.date).toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      logins: row.logins,
      discussions: row.discussions,
      // avgTime: faker.number.float({ min: 1, max: 3, fractionDigits: 1 }), // NOTE: placeholder
    }));
  }

  /**
   * @async
   * @description Calculates and formats learning analytics metrics for the radar chart.
   * @param {string} instructorId - The UUID of the instructor.
   * @returns {Promise<object>} The formatted data for the radar chart.
   */
  public static async getLearningAnalytics(instructorId: string) {
    const { timelinessData, resourceData } =
      await AnalyticsRepository.getLearningAnalyticsRawData(instructorId);

    // NOTE: Placeholder logic since we don't have real due dates or submission tables.
    const onTimePercentage = 92;

    // NOTE: Placeholder logic. A real system would compare downloads vs. total available resources.
    const resourceUtilization = 65;

    return [
      { subject: 'Content Engagement', current: 85, target: 90 },
      { subject: 'Quiz Performance', current: 78, target: 80 },
      { subject: 'Discussion Quality', current: 70, target: 75 },
      {
        subject: 'Assignment Timeliness',
        current: onTimePercentage,
        target: 95,
      },
      {
        subject: 'Resource Utilization',
        current: resourceUtilization,
        target: 70,
      },
      { subject: 'Avg Session Duration', current: 88, target: 85 },
    ];
  }

  /**
   * Retrieves the average grade for a student in a specific course using locally replicated data.
   * @param courseId - The ID of the course.
   * @param studentId - The ID of the student.
   * @returns The average grade as a number (0-100) or null if no grades are available.
   */
  public static async getStudentAverageGrade(
    courseId: string,
    studentId: string
  ) {
    logger.info(
      `Calculating average grade for student ${studentId} in course ${courseId} from local data`
    );
    const averageGrade = await StudentGradeRepository.getAverageGradeForCourse(
      courseId,
      studentId
    );

    if (averageGrade === null) {
      return { averageGrade: null, letterGrade: null };
    }

    let letterGrade = 'F';
    if (averageGrade >= 90) letterGrade = 'A';
    else if (averageGrade >= 80) letterGrade = 'B';
    else if (averageGrade >= 70) letterGrade = 'C';
    else if (averageGrade >= 60) letterGrade = 'D';

    return { averageGrade, letterGrade };
  }

  /**
   * Retrieves the total discussion count for an instructor.
   * @param instructorId The ID of the instructor.
   * @returns The total discussion count.
   */
  public static async getDiscussionEngagement(instructorId: string) {
    const totalDiscussions =
      await AnalyticsRepository.getTotalDiscussionsByInstructor(instructorId);

    // NOTE: This is a simple heuristic to scale the row count to a 0-100 value for the chart.
    const engagementScore = Math.min((totalDiscussions / 50) * 100, 100);

    return { totalDiscussions, engagementScore };
  }

  /**
   * Retrievves statistics for a single course.
   * @param courseId
   */
  public static async getCourseStats(courseId: string) {
    const { totalStudents, avgCompletion, previousAvgCompletion } =
      await AnalyticsRepository.getStatsForCourse(courseId);

    const completionRateChange = this.calculatePercentageChange(
      avgCompletion,
      previousAvgCompletion
    );

    return { totalStudents, avgCompletion, completionRateChange };
  }

  /**
   * Gets top performers and students at risk for a specific course.
   * @param courseId The ID of the course.
   */
  public static async getStudentPerformance(courseId: string) {
    logger.info(`Fetching student performance data for course ${courseId}`);

    const allStudents =
      await AnalyticsRepository.getStudentPerformanceForCourse(courseId);

    const topPerformers = allStudents.slice(0, 3);
    const studentsAtRisk = allStudents.slice(-3).reverse();

    return { topPerformers, studentsAtRisk };
  }

  /**
   * Aggregates activity statistics for a given course.
   * - Calculates enrollment trends (last 30 vs previous 30 days).
   * - Counts total discussions.
   * - Fetches last 5 activity events.
   * - Placeholder for resource downloads & session times.
   *
   * @param courseId The ID of the course.
   * @returns Aggregated activity stats for the course.
   */
  public static async getCourseActivityStats(courseId: string) {
    logger.info(`Fetching activity stats for course ${courseId}`);
    const stats = await AnalyticsRepository.getActivityStatsForCourse(courseId);

    const enrollmentChange = this.calculatePercentageChange(
      stats.enrollmentsLast30Days,
      stats.enrollmentsPrevious30Days
    );

    const resourceDownloadsChange = this.calculatePercentageChange(
      stats.resourceDownloadsLast30Days,
      stats.resourceDownloadsPrevious30Days
    );

    return {
      enrollmentChange,
      totalDiscussions: stats.totalDiscussions,
      recentActivity: stats.recentActivity,
      resourceDownloads: {
        value: stats.resourceDownloadsLast30Days,
        change: resourceDownloadsChange,
      },
      avgSessionTime: { value: '12m', change: 5 }, // Placeholder
    };
  }

  public static async getModulePerformance(courseId: string) {
    logger.info(`Fetching module performance for course ${courseId}`);

    const moduleCompletionRates =
      await AnalyticsRepository.getModuleCompletionRates(courseId);

    const performanceData = moduleCompletionRates.map((item) => ({
      moduleId: item.module_id,
      completionRate: parseFloat(item.completion_rate),
      avgScore: item.average_grade ? parseFloat(item.average_grade) : 0,
      timeSpent: '1h 30m', // Placeholder
      satisfaction: 4.5, // Placeholder
    }));

    return performanceData;
  }

  /**
   * @description Fetches and formats the average session time for a specific course.
   * @param {string} courseId - The unique identifier of the course.
   * @returns {Promise<{value: string, change: number}>} An object containing the formatted average time and a change indicator.
   */
  public static async getAverageSessionTime(courseId: string) {
    logger.info(`Fetching average session time for course ${courseId}`);
    const avgTime = await AnalyticsRepository.getAverageSessionTime(courseId);

    return {
      value: `${avgTime}m`,
      change: 0, // Placeholder
    };
  }

  /**
   * Logs the start of a lesson viewing session.
   * @returns The generated sessionId for the client to hold.
   */
  public static async logSessionStart(
    userId: string,
    courseId: string,
    moduleId: string,
    lessonId: string
  ) {
    const sessionId = uuidv4();
    logger.info(`Logging start of session ${sessionId} for lesson ${lessonId}`);
    await AnalyticsRepository.startLessonSession({
      sessionId,
      userId,
      courseId,
      moduleId,
      lessonId,
      startedAt: new Date(),
    });
    return { sessionId };
  }

  /**
   * Logs the end of a lesson viewing session and calculates its duration.
   */
  public static async logSessionEnd(sessionId: string) {
    logger.info(`Logging end of session ${sessionId}`);

    const session =
      await AnalyticsRepository.findLessonSessionBySessionId(sessionId);

    if (!session || session.endedAt) {
      return;
    }

    const endedAt = new Date();
    const durationMs = endedAt.getTime() - session.startedAt.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    await AnalyticsRepository.endLessonSession(
      sessionId,
      endedAt,
      durationMinutes
    );
  }

  /**
   * @description Fetches and formats time-spent analytics for a course.
   * @param {string} courseId - The unique identifier of the course.
   * @returns An object containing the formatted average session time and module-specific time spent.
   */
  public static async getTimeSpentAnalytics(courseId: string) {
    logger.info(`Fetching time-spent analytics for course ${courseId}`);

    const [avgTime, moduleTimes] = await Promise.all([
      AnalyticsRepository.getAverageSessionTime(courseId),
      AnalyticsRepository.getTotalTimeSpentPerModule(courseId),
    ]);

    const formatMinutes = (minutes: number) => {
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    };

    return {
      avgSessionTime: {
        value: formatMinutes(avgTime),
        change: 0, // Placeholder for trend
      },
      modulePerformance: moduleTimes.map((m) => ({
        moduleId: m.moduleId,
        timeSpent: formatMinutes(m.timeSpent),
      })),
    };
  }

  /**
   * Fetches overall instructor statistics (delegates to AnalyticsRepository).
   * @param instructorId - The UUID of the instructor.
   * @returns A promise resolving to an object with:
   *  - avgCompletion: string (percentage, 1 decimal place)
   *  - avgGrade: number | null (average grade if available, otherwise null)
   */
  public static async getOverallInstructorStats(instructorId: string) {
    logger.info(`Fetching overall stats for instructor ${instructorId}`);

    const { current, previous } =
      await AnalyticsRepository.getOverallInstructorStats(instructorId);

    const completionChange = this.calculatePercentageChange(
      parseFloat(current.avgCompletion),
      parseFloat(previous.avgCompletion)
    );

    const gradeChange = this.calculatePercentageChange(
      current.avgGrade || 0,
      previous.avgGrade || 0
    );

    return {
      avgCompletion: current.avgCompletion,
      avgGrade: current.avgGrade,
      completionChange,
      gradeChange,
    };
  }

  /**
   * Fetches the engagement score for an instructor based on recent activity logs.
   * @param instructorId - The UUID of the instructor.
   * @returns A promise resolving to an object with:
   *  - score: number (activities in last 30 days)
   *  - change: number (percentage change vs. previous period)
   */
  public static async getEngagementScore(instructorId: string) {
    logger.info(`Fetching engagement score for instructor ${instructorId}`);

    const { currentPeriodActivity, previousPeriodActivity } =
      await AnalyticsRepository.getEngagementTrend(instructorId);

    // NOTE: The "score" is the raw number of activities in the last 30 days.
    // The "change" is the trend.
    const change = this.calculatePercentageChange(
      currentPeriodActivity,
      previousPeriodActivity
    );

    return {
      score: currentPeriodActivity,
      change,
    };
  }

  public static async getGradeDistribution(instructorId: string) {
    logger.info(`Fetching grade distribution for instructor ${instructorId}`);

    return AnalyticsRepository.getGradeDistribution(instructorId);
  }

  public static async getStudentPerformanceOverview(instructorId: string) {
    logger.info(
      `Fetching student performance overview for instructor ${instructorId}`
    );
    const allStudents =
      await AnalyticsRepository.getStudentPerformanceOverview(instructorId);

    return {
      topPerformers: allStudents.slice(0, 5),
      studentsAtRisk: allStudents.slice(-5).reverse(),
    };
  }

  public static async getEngagementDistribution(instructorId: string) {
    logger.info(
      `Fetching engagement distribution for instructor ${instructorId}`
    );

    const distribution =
      await AnalyticsRepository.getEngagementDistribution(instructorId);

    return distribution.map((item) => ({
      activity: item.activity
        .replace('_', ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      students: item.count,
    }));
  }

  /**
   * Request report generation
   * @param requesterId ID of the user requesting the report
   * @param reportType Type of report to generate
   * @param format Format of the report ('csv' | 'pdf')
   * @returns Promise with job information
   */
  public static async requestReportGeneration(
    requesterId: string,
    reportType: string,
    format: 'csv' | 'pdf'
  ): Promise<{ jobId: string; message: string }> {
    logger.info(
      `Report request received from ${requesterId} for ${reportType} in ${format} format.`
    );

    let payload: StudentPerformance[];
    if (reportType === 'student_performance') {
      payload =
        await AnalyticsRepository.getStudentPerformanceOverview(requesterId);
    } else {
      throw new BadRequestError('Invalid report type specified.');
    }

    const job = await AnalyticsRepository.createReportJob({
      requesterId,
      reportType,
      format,
    });

    try {
      const publisher = new ReportGenerationRequestedPublisher();

      await publisher.publish({
        jobId: job.id,
        requesterId,
        reportType,
        format,
        payload,
      });
    } catch (err) {
      logger.error('Failed to publish report generation event', err);
    }

    return {
      jobId: job.id,
      message:
        'Report generation has started. You will be notified upon completion.',
    };
  }

  /**
   * Retrieves the overall average grade for a specific student.
   * @param studentId The ID of the student.
   * @returns An object containing the average grade.
   */
  public static async getOverallStudentAverageGrade(studentId: string) {
    logger.info(`Fetching overall average grade for student ${studentId}`);

    const averageGrade =
      await AnalyticsRepository.getOverallAverageGradeForStudent(studentId);

    return { averageGrade };
  }

  /**
   * Gets the study streak for a specific student.
   * @param studentId The ID of the student.
   * @returns An object containing the streak count.
   */
  public static async getStudentStudyStreak(studentId: string) {
    logger.info(`Fetching study streak for student ${studentId}`);

    const streak = await AnalyticsRepository.calculateStudyStreak(studentId);

    return { streak };
  }
}
