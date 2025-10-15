import { faker } from '@faker-js/faker';
import axios from 'axios';
import { differenceInHours, format, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { CommunityClient } from '../clients';
import { CourseClient } from '../clients/course.client';
import { UserClient } from '../clients/user.client';
import { env } from '../config/env';
import logger from '../config/logger';
import {
  CourseRepository,
  EnrollRepository,
  StudentGradeRepository,
} from '../db/repositories';
import { AnalyticsRepository } from '../db/repositories/analytics.repository';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
  ReportGenerationRequestedPublisher,
  StudentGradeRecheckRequestedPublisher,
} from '../events/publisher';
import { GeminiClient } from '../features/ai/client/gemini.client';
import { AIPrompt } from '../features/ai/prompts';
import { buildRecommendationSystemPrompt } from '../features/ai/prompts/assignmentRecommendation.prompt';
import { buildInsightSystemPrompt } from '../features/ai/prompts/insight.prompt';
import {
  AssignmentResponse,
  assignmentResponse,
  assignmentResponseSchema,
} from '../features/ai/responseSchema/assignmentRecommendationResponse.schema';
import { feedbackResponseSchema } from '../features/ai/responseSchema/feedbackResponse.schema';
import {
  AIProgressInsight,
  aiProgressInsightArraySchema,
  aiProgressInsightsResponseSchema,
  LearningRecommendation,
  learningRecommendationResponseSchema,
  learningRecommendationSchema,
  PerformanceHighlights,
  performanceHighlightsResponseSchema,
  performanceHighlightsZodSchema,
  PerformancePrediction,
  performancePredictionResponseSchema,
  performancePredictionSchema,
  PredictiveChartData,
  predictiveChartDataSchema,
  predictiveChartResponseSchema,
} from '../features/ai/schema';
import {
  FeedbackResponseSchema,
  feedbackResponseSchemaZod,
} from '../features/ai/schema/feedback.schema';
import {
  Assignment,
  AssignmentAnalytics,
  assignmentAnalyticsSchema,
  assignmentSchema,
  GetMyGradesQuery,
  ModuleCompletionData,
  ReportFormat,
  ReportType,
  StudyHabit,
  StudyTimeTrend,
} from '../schema';
import {
  Grade,
  Milestone,
  Requester,
  StudentPerformance,
  UserProfileData,
} from '../types';

interface ModuleDetails {
  id: string;
  title: string;
}

interface CourseDetails {
  id: string;
  title: string;
}

export class AnalyticsService {
  private static ai = GeminiClient.getInstance();
  private static model: string = 'gemini-2.5-flash-lite';

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
  public static async requestReport(
    requester: Requester,
    reportType: ReportType,
    format: ReportFormat,
    filters?: GetMyGradesQuery
  ): Promise<
    | {
        jobId: string;
        message: string;
      }
    | undefined
  > {
    logger.info(
      `User ${requester.id} requested a '${format}' report of type '${reportType}'.`,
      { filters }
    );

    let payload: Grade[] | StudentPerformance[];

    if (reportType === 'student_grades') {
      const { results } = await this.getMyGrades(requester.id, {
        ...filters,
        page: 1,
        limit: 10000,
      });
      if (results.length === 0) {
        throw new BadRequestError(
          'No data available to generate a report for the selected filters.'
        );
      }
      payload = results;
    } else if (reportType === 'student_performance') {
      payload = await AnalyticsRepository.getStudentPerformanceOverview(
        requester.id
      );

      if (payload.length === 0) {
        throw new BadRequestError(
          'No performance data available to generate a report.'
        );
      }
    } else {
      throw new BadRequestError('Invalid report type specified.');
    }

    const job = await AnalyticsRepository.createReportJob({
      requesterId: requester.id,
      reportType,
      format,
    });
    const jobId = job.id;

    try {
      const publisher = new ReportGenerationRequestedPublisher();

      await publisher.publish({
        jobId: job.id,
        requesterId: requester.id,
        requesterEmail: requester.email,
        reportType,
        format,
        payload,
      });

      logger.info(
        `Successfully published report generation request with Job ID: ${jobId}`
      );

      return {
        jobId,
        message:
          'Report generation has started. You will be notified upon completion.',
      };
    } catch (err) {
      logger.error('Failed to publish report generation event', err);
    }
  }

  /**
   * Retrieves the overall average grade and percentage change for a specific student.
   * - Calculates the percentage change between the two periods.
   * @param studentId - The unique identifier of the student.
   * @returns An object containing:
   * - `averageGrade`: The student's average grade for the last 30 days, or `null` if unavailable.
   * - `change`: The percentage change compared to the previous 30-day period.
   */
  public static async getOverallStudentAverageGrade(studentId: string) {
    logger.info(`Fetching overall average grade for student ${studentId}`);

    const { current, previous } =
      await AnalyticsRepository.getOverallAverageGradeForStudent(studentId);

    const change = this.calculatePercentageChange(current || 0, previous || 0);

    return { averageGrade: current, change };
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

  /**
   * Gets the complete leaderboard and stats for the current user.
   * @param userId The ID of the user making the request.
   */
  public static async getLeaderboardStats(userId: string) {
    const rawStats =
      await AnalyticsRepository.getLeaderboardAndUserStats(userId);
    const streak = await AnalyticsRepository.calculateStudyStreak(userId);

    const currentUserStats = rawStats.find((u) => u.user_id === userId) || {
      rank: 0,
      points: 0,
      courses_completed: 0,
      assignments_done: 0,
    };

    const top5 = rawStats.filter((u) => u.rank <= 5);
    const userIdsToFetch = top5.map((u) => u.user_id);
    const userProfiles = await UserClient.getPublicProfiles(userIdsToFetch);

    const leaderboard = top5.map((u) => {
      const profile = userProfiles.get(u.user_id);
      const name = profile
        ? `${profile.lastName || ''} ${profile.lastName || ''}`.trim()
        : 'Anonymous';

      return {
        rank: u.rank,
        name: name,
        initials: name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        streak: 0,
        points: Math.round(u.points * 10),
      };
    });

    const achievements = [];
    if (streak > 10)
      achievements.push({ title: '10+ day streak', icon: 'Flame' });
    if (currentUserStats.assignments_done > 15)
      achievements.push({ title: 'Helped 15+ students', icon: 'Users' }); // Placeholder
    if (currentUserStats.courses_completed >= 3)
      achievements.push({ title: 'Finished 3 courses', icon: 'CheckCircle' });

    return {
      leaderboard,
      userStats: {
        rank: currentUserStats.rank,
        points: Math.round(currentUserStats.points * 10),
        stats: [
          { label: 'Study Streak', value: `${streak} days` },
          {
            label: 'Courses Completed',
            value: currentUserStats.courses_completed.toString(),
          },
          {
            label: 'Assignments Done',
            value: currentUserStats.assignments_done.toString(),
          },
          { label: 'Community Help', value: '18 answers' }, // Static placeholder
        ],

        achievements,
      },
    };
  }

  /**
   * Retrieves and formats the study time trend for a user for the last 7 days.
   * @param userId The ID of the user.
   * @returns An array of objects formatted for the chart, including days with zero hours.
   */
  public static async getStudyTimeTrend(userId: string) {
    const trendData = await AnalyticsRepository.getStudyTrendForUser(userId);
    const trendMap = new Map(
      trendData.map((d) => [d.day, parseFloat(d.totalMinutes || '0') / 60])
    );

    const last7Days = Array.from({ length: 7 })
      .map((_, i) => {
        const date = subDays(new Date(), i);
        return {
          date: format(date, 'yyyy-MM-dd'),
          day: format(date, 'E'),
        };
      })
      .reverse();

    return last7Days.map((dayInfo) => ({
      day: dayInfo.day,
      hours: trendMap.get(dayInfo.date) || 0,
    }));
  }

  /**
   * Retrieves the weekly study time trend for a student.
   * @param studentId The ID of the student.
   * @returns An array of weekly study data, including a placeholder for target hours.
   */
  public static async getWeeklyStudyTimeTrend(
    studentId: string
  ): Promise<StudyTimeTrend[]> {
    logger.info(`Fetching study time trend for student ${studentId}`);

    try {
      const [weeklyData, targetHours] = await Promise.all([
        AnalyticsRepository.getWeeklyStudyTrend(studentId),
        UserClient.getWeeklyStudyGoal(studentId),
      ]);

      return weeklyData.map((week) => ({
        ...week,
        target: targetHours,
      }));
    } catch (error) {
      logger.error(
        `Failed to get study time trend for student ${studentId}: %o`,
        {
          error,
        }
      );

      return [];
    }
  }

  /**
   * Generates AI insights for a user based on their course performance and study streak.
   * @param {string} userId - The ID of the user to generate insights for.
   * @returns {Promise<FeedbackResponseSchema>} - The validated AI-generated insights.
   */
  public static async getAIInsights(
    userId: string,
    cookie: string
  ): Promise<FeedbackResponseSchema> {
    logger.info(`Fetching AI insights for user ${userId}`);

    const cachedInsights = await AnalyticsRepository.getLatestInsights(userId);
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (
      cachedInsights &&
      new Date().getTime() - cachedInsights.generatedAt.getTime() <
        twentyFourHours
    ) {
      logger.info(`Returning cached AI insights for user ${userId}`);

      return cachedInsights.insights;
    }

    logger.info(`Generating AI insights for user ${userId}`);

    const performanceData =
      await AnalyticsRepository.getStudentPerformanceOverview(userId);
    if (performanceData.length === 0) {
      return [];
    }

    const topCourseData = performanceData[0];
    const weakestCourseData = performanceData[performanceData.length - 1];

    const courseIds = [topCourseData.courseId, weakestCourseData.courseId];
    const courseDetailsMap = await CourseClient.getCoursesByIds(courseIds);

    const streak = await AnalyticsRepository.calculateStudyStreak(userId);
    const pendingAssignments =
      await CourseClient.getPendingAssignmentsCount(cookie);

    const context = {
      topCourse: {
        title:
          courseDetailsMap.get(topCourseData.courseId)?.title || 'Top Course',
        progress: parseFloat(topCourseData.progressPercentage),
        grade: topCourseData.averageGrade ?? null,
      },
      weakestCourse: {
        title:
          courseDetailsMap.get(weakestCourseData.courseId)?.title ||
          'Course to Review',
        progress: parseFloat(weakestCourseData.progressPercentage),
        grade: topCourseData.averageGrade ?? null,
      },
      studyStreak: streak,
      pendingAssignments,
    };

    const systemInstruction = buildInsightSystemPrompt(context);

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: 'Generate the insights now.',
      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        responseSchema: feedbackResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = JSON.parse(response.text);
    const validated: FeedbackResponseSchema =
      feedbackResponseSchemaZod.parse(parsed);

    await AnalyticsRepository.upsertInsights(userId, validated);
    logger.info(`Saved new AI insights to cache for user ${userId}`);

    return validated;
  }

  /**
   * Gets a feed of recent, enriched activity from across the platform.
   * @returns A promise that resolves to an array of formatted activity feed items.
   */
  public static async getLiveActivityFeed() {
    const recentActivities = await AnalyticsRepository.getRecentActivityLogs(5);
    if (recentActivities.length === 0) return [];

    const userIds = [...new Set(recentActivities.map((a) => a.userId))];
    const courseIds = [...new Set(recentActivities.map((a) => a.courseId))];

    const [userMap, courseMap] = await Promise.all([
      UserClient.getPublicProfiles(userIds),
      CourseRepository.findManyByIds(courseIds).then(
        (courses) => new Map(courses.map((c) => [c.id, c]))
      ),
    ]);

    return recentActivities.map((activity) => {
      const user = userMap.get(activity.userId);
      const course = courseMap.get(activity.courseId);
      let actionText = 'did something in';

      switch (activity.activityType) {
        case 'enrollment':
          actionText = 'just enrolled in';
          break;
        case 'lesson_completion':
          actionText = 'completed a lesson in';
          break;
        case 'resource_download':
          actionText = 'downloaded a resource from';
          break;
      }

      return {
        id: activity.id,
        userName:
          `${user?.firstName || 'Someone'} ${user?.lastName || ''}`.trim(),
        userAvatar: user?.avatarUrls?.small || null,
        actionText,
        subject: course?.title || 'a course',
        timestamp: activity.createdAt.toISOString(),
        type: activity.activityType,
      };
    });
  }

  /**
   * Get AI-powered study recommendations for the user.
   * @param {string} cookie - User authentication cookie.
   * @param {string} userId - The ID of the user.
   * @throws {Error} If AI response is missing or invalid.
   */
  public static async getAIStudyRecommendations(
    cookie: string,
    userId: string
  ) {
    logger.info(`Fetching AI study recommendations for user ${userId}`);

    const cachedRecs =
      await AnalyticsRepository.getLatestRecommendations(userId);
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (
      cachedRecs &&
      new Date().getTime() - cachedRecs.generatedAt.getTime() < twentyFourHours
    ) {
      logger.info(`Returning cached AI recommendations for user ${userId}`);
      return cachedRecs.recommendations;
    }

    logger.info(`Generating AI study recommendations for user`);

    const pendingAssignments = await CourseClient.getPendingAssignments(cookie);

    if (pendingAssignments.length === 0) {
      return [
        {
          priority: 'low',
          title: 'All Caught Up!',
          description:
            'You have no pending assignments. Great job! Consider starting a new course to keep learning.',
          hours: 0,
          dueDate: new Date().toISOString(),
        },
      ];
    }

    const context = {
      pendingAssignments: pendingAssignments.map((a) => ({
        title: a.title,
        course: 'Course Name',
        dueDate: a.dueDate,
      })),
    };
    const systemInstruction = buildRecommendationSystemPrompt(context);

    const ai = GeminiClient.getInstance();

    const response = await ai.models.generateContent({
      model: this.model,
      contents: 'Generate the study recommendations now.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: assignmentResponse,
        systemInstruction,
      },
    });

    if (!response.text) {
      throw new Error('No response text received from AI.');
    }

    let validated: AssignmentResponse;
    try {
      const data = JSON.parse(response.text);
      validated = assignmentResponseSchema.parse(data);
    } catch (err) {
      logger.error('Failed to parse or validate AI response:', err);
      throw err;
    }

    await AnalyticsRepository.upsertRecommendations(userId, validated);

    return validated;
  }

  /**
   * Retrieves and formats assignment analytics for a specific student and course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @returns Formatted analytics data for the frontend.
   */
  public static async getStudentAssignmentAnalytics(
    courseId: string,
    studentId: string
  ): Promise<AssignmentAnalytics> {
    const enrollment = await EnrollRepository.findByUserAndCourse(
      studentId,
      courseId
    );
    if (!enrollment) {
      throw new ForbiddenError('Student is not enrolled in this course');
    }

    if (enrollment.status === 'suspended') {
      throw new ForbiddenError('Enrollment is suspended');
    }

    let assignmentForCourse: Assignment[];
    try {
      const rawAssignments =
        await CourseClient.getAssignmentsForCourse(courseId);

      if (!rawAssignments) {
        throw new NotFoundError('Course not found or has no assignments');
      }

      if (!Array.isArray(rawAssignments)) {
        throw new BadRequestError('Invalid assignments data structure');
      }

      assignmentForCourse = rawAssignments.map((assignment) =>
        assignmentSchema.parse(assignment)
      );
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      throw new Error(
        `Failed to fetch course assignments: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    const hasSubmissions = await StudentGradeRepository.hasSubmissions(
      courseId,
      studentId
    );
    const submissionCount = hasSubmissions?.[0]?.count || 0;

    let rawAnalytics;
    let trendsData;
    let gradeDistributionData;

    try {
      rawAnalytics = await AnalyticsRepository.getStudentAssignmentAnalytics(
        courseId,
        studentId,
        assignmentForCourse
      );

      if (!rawAnalytics || typeof rawAnalytics !== 'object') {
        throw new Error('Invalid analytics data received from repository');
      }

      [trendsData, gradeDistributionData] = await Promise.all([
        AnalyticsRepository.getMonthlySubmissionTrends(courseId, studentId),
        AnalyticsRepository.getGradeDistributionForStudent(courseId, studentId),
      ]);
    } catch (error) {
      if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof ForbiddenError
      ) {
        throw error;
      }

      throw new Error(
        `Failed to fetch analytics data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    const { totalSubmissions, averageGrade, onTimeRate, onTimeCount } =
      rawAnalytics;

    const insightsData = this.generateInsights(
      averageGrade,
      onTimeRate,
      totalSubmissions,
      trendsData
    );

    const gradeFills: Record<string, string> = {
      'A+': 'var(--color-a-plus)',
      A: 'var(--color-a)',
      'A-': 'var(--color-a-minus)',
      'B+': 'var(--color-b-plus)',
      B: 'var(--color-b)',
      'B-': 'var(--color-b-minus)',
      'C+': 'var(--color-c-plus)',
      C: 'var(--color-c)',
      'C-': 'var(--color-c-minus)',
      D: 'var(--color-d)',
      F: 'var(--color-f)',
    };

    const formattedGradeDistribution = gradeDistributionData.map((item) => ({
      ...item,
      fill: gradeFills[item.grade] || 'var(--color-default)',
    }));

    const submissionChange = this.calculateSubmissionChange(trendsData);
    const gradeChange = this.calculateGradeChange(trendsData);

    const analyticsResponse = {
      stats: [
        {
          title: 'Total Submitted',
          value: totalSubmissions.toString(),
          change: submissionChange,
          Icon: 'FileText',
        },
        {
          title: 'Average Grade',
          value: `${averageGrade.toFixed(1)}%`,
          change: gradeChange,
          Icon: 'BarChart2',
        },
        {
          title: 'On-Time Rate',
          value: `${(onTimeRate * 100).toFixed(0)}%`,
          description: `${onTimeCount} of ${totalSubmissions} assignments`,
          Icon: 'Clock',
        },
      ],
      trends: trendsData,
      gradeDistribution: formattedGradeDistribution,
      insights: insightsData,
    };

    try {
      return assignmentAnalyticsSchema.parse(analyticsResponse);
    } catch (error) {
      throw new Error(
        `Failed to validate analytics response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private static generateInsights(
    averageGrade: number,
    onTimeRate: number,
    totalSubmissions: number,
    trendsData: any[]
  ) {
    const insights = [];

    if (trendsData.length >= 2) {
      const recentAvg =
        trendsData.slice(-3).reduce((sum, t) => sum + t.grade, 0) /
        Math.min(3, trendsData.length);
      const olderAvg =
        trendsData.slice(0, 3).reduce((sum, t) => sum + t.grade, 0) /
        Math.min(3, trendsData.length);
      const improvement = recentAvg - olderAvg;

      if (improvement > 0) {
        insights.push({
          title: 'Strong Performance Trend',
          text: `Your grades have improved by ${improvement.toFixed(1)}% recently. Keep up the excellent work!`,
          Icon: 'TrendingUp',
          color: 'bg-green-500/10 text-green-500',
        });
      }
    }

    if (onTimeRate < 0.7 && totalSubmissions > 0) {
      insights.push({
        title: 'Improvement Opportunity',
        text: 'Consider starting assignments earlier. Your best grades come from submissions made 2+ days before the deadline.',
        Icon: 'Lightbulb',
        color: 'bg-blue-500/10 text-blue-500',
      });
    }

    if (totalSubmissions >= 5) {
      insights.push({
        title: 'Consistent Engagement',
        text: 'You are actively participating in the course. This consistent effort enhances your learning experience.',
        Icon: 'Users',
        color: 'bg-purple-500/10 text-purple-500',
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: 'Getting Started',
        text: 'Complete more assignments to receive personalized insights about your performance.',
        Icon: 'Info',
        color: 'bg-gray-500/10 text-gray-500',
      });
    }

    return insights;
  }

  private static calculateSubmissionChange(trendsData: any[]): string {
    if (trendsData.length < 2) return '+0%';

    const recent = trendsData[trendsData.length - 1]?.submissions || 0;
    const previous = trendsData[trendsData.length - 2]?.submissions || 0;

    if (previous === 0) return '+0%';

    const change = ((recent - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  }

  private static calculateGradeChange(trendsData: any[]): string {
    if (trendsData.length < 2) return '+0%';

    const recent = trendsData[trendsData.length - 1]?.grade || 0;
    const previous = trendsData[trendsData.length - 2]?.grade || 0;

    if (previous === 0) return '+0%';

    const change = ((recent - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  }

  /**
   * Retrieves a student's grades, enriched with module name.
   * @param studentId The ID of the student.
   * @param options The query options for filtering and pagination.
   * @returns A paginated result of the student's grades.
   */
  public static async getMyGrades(
    studentId: string,
    options: GetMyGradesQuery
  ) {
    const { totalResults, results: rawGrades } =
      await AnalyticsRepository.findMyGrades(studentId, options);

    if (rawGrades.length === 0) {
      return {
        results: [],
        pagination: {
          currentPage: options.page,
          totalPages: 0,
          totalResults: 0,
        },
      };
    }

    const courseIds = [...new Set(rawGrades.map((g) => g.courseId))];
    const moduleIds = [
      ...new Set(rawGrades.map((g) => g.moduleId).filter(Boolean) as string[]),
    ];
    const assignmentIds = [...new Set(rawGrades.map((g) => g.assignmentId))];

    const [courseMap, moduleMap, assignmentMap] = await Promise.all([
      CourseClient.getCoursesByIds(courseIds),
      CourseClient.getModulesByIds(moduleIds),
      CourseClient.getAssignmentsByIds(assignmentIds),
    ]);

    let enrichedResults = rawGrades.map((grade) => ({
      id: grade.submissionId,
      course: courseMap.get(grade.courseId)?.title || 'Unknown Course',
      assignment:
        assignmentMap.get(grade.assignmentId)?.title || 'Unknown Assignment',
      module: grade.moduleId ? moduleMap.get(grade.moduleId) || 'N/A' : 'N/A',
      grade: grade.grade,
      status: (grade.grade !== null ? 'Graded' : 'Pending') as
        | 'Graded'
        | 'Pending',
      submitted: grade.gradedAt,
    }));

    if (options.q) {
      enrichedResults = enrichedResults.filter((result) =>
        result.assignment.toLowerCase().includes(options.q!.toLowerCase())
      );
    }

    return {
      results: enrichedResults,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(totalResults / options.limit),
        totalResults,
      },
    };
  }

  /**
   * Retrieves the details for a single submission, verifying ownership.
   * @param submissionId The ID of the submission.
   * @param requesterId The ID of the user making the request.
   * @param cookie The raw cookie header for service-to-service auth.
   * @returns The full submission details.
   */
  public static async getSubmissionDetails(
    submissionId: string,
    requesterId: string,
    cookie: string
  ) {
    const submission =
      await AnalyticsRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new NotFoundError('Submission');
    }

    if (submission.studentId !== requesterId) {
      throw new ForbiddenError(
        'You do not have permission to view this submission.'
      );
    }

    const submissionContent = await CourseClient.getSubmissionContent(
      submissionId,
      cookie
    );

    return { ...submission, content: submissionContent };
  }

  /**
   * Initiates a re-grade request for a submission.
   * Orchestrates a call to the course-service and publishes an event upon success.
   * @param submissionId The ID of the submission.
   * @param requester The user making the request.
   * @param cookie The raw cookie for authenticating the service-to-service call.
   */
  public static async requestReGrade(
    submissionId: string,
    requester: Requester,
    cookie: string
  ): Promise<void> {
    logger.info(
      `Processing re-grade request from user ${requester.id} for submission ${submissionId}`
    );

    const submission =
      await AnalyticsRepository.findSubmissionById(submissionId);
    if (!submission || submission.studentId !== requester.id) {
      throw new ForbiddenError(
        'You do not have permission to request a re-grade for this submission.'
      );
    }

    await CourseClient.requestReGrade(submissionId, cookie);

    try {
      const publisher = new StudentGradeRecheckRequestedPublisher();
      await publisher.publish({
        submissionId: submission.id!,
        studentId: submission.studentId,
        courseId: submission.courseId,
        requestedAt: new Date(),
      });
    } catch (error) {
      logger.error(
        `Failed to publish student.grade.recheck.requested event for submission ${submissionId}: %o`,
        { error }
      );
    }
  }

  /**
   * Retrieves analytics for comparing a student's performance against class averages.
   * @param courseId The primary course for comparison.
   * @param studentId The ID of the student.
   * @returns A comprehensive analytics object for the comparison tab.
   */
  public static async getStudentComparisonAnalytics(
    courseId: string,
    studentId: string
  ) {
    return this.getComparisonAnalyticsData(courseId, studentId);
  }

  /**
   * Helper to get a student's average grade for multiple courses.
   * @param studentId The ID of the student.
   * @param courseIds An array of course IDs.
   * @returns A Map where the key is courseId and the value is the student's average grade.
   */
  private static async getStudentAverageGrades(
    studentId: string,
    courseIds: string[]
  ): Promise<Map<string, number>> {
    const gradesMap = new Map<string, number>();
    if (courseIds.length === 0) return gradesMap;

    const results = await AnalyticsRepository.getAverageGradesByCourses(
      studentId,
      courseIds
    );
    results.forEach((row) => {
      gradesMap.set(row.courseId, parseFloat(row.avgGrade || '0'));
    });

    return gradesMap;
  }

  /**
   * Generates personalized performance highlights using an AI model.
   * @param analyticsData The aggregated analytics data for the student.
   * @returns A promise that resolves to an array of AI-generated insights. Returns a default set on failure.
   */
  private static async _generatePerformanceHighlights(analyticsData: {
    performanceChart: {
      subject: string;
      yourScore: number;
      classAverage: number;
    }[];
    classRanking: { rank: number | null; totalStudents: number };
  }): Promise<PerformanceHighlights> {
    try {
      if (analyticsData.performanceChart.length === 0) {
        throw new Error('Not enough data to generate highlights.');
      }

      const totalYourScore = analyticsData.performanceChart.reduce(
        (sum, item) => sum + item.yourScore,
        0
      );
      const totalClassAverage = analyticsData.performanceChart.reduce(
        (sum, item) => sum + item.classAverage,
        0
      );
      const averagePerformance =
        totalClassAverage > 0 ? totalYourScore / totalClassAverage : 1;

      const bestCourse = analyticsData.performanceChart.reduce(
        (best, current) => {
          return current.yourScore > best.yourScore ? current : best;
        },
        analyticsData.performanceChart[0]
      );

      const context = {
        rank: analyticsData.classRanking.rank,
        totalStudents: analyticsData.classRanking.totalStudents,
        bestCourse: bestCourse
          ? { subject: bestCourse.subject, yourScore: bestCourse.yourScore }
          : null,
        averagePerformance,
      };

      const systemInstruction =
        AIPrompt.buildPerformanceHighlightsPrompt(context);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Generate the performance highlights now.' }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: performanceHighlightsResponseSchema,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('No response text from AI provider.');
      }

      const parsed = JSON.parse(text);
      const validated = performanceHighlightsZodSchema.parse(parsed);

      return validated.highlights;
    } catch (error) {
      logger.error(
        'Failed to generate AI performance highlights. Returning default. %o',
        { error }
      );

      return [
        {
          title: 'Great Effort!',
          text: "You're actively participating and completing your assignments. Keep up the great work!",
        },
        {
          title: 'Keep Growing',
          text: 'Every assignment is an opportunity to learn. Continue to review your feedback to improve.',
        },
        {
          title: 'Well Done',
          text: 'Consistency is key in learning, and you are on the right track.',
        },
      ];
    }
  }

  /**
   * Generates or retrieves cached AI performance highlights for a student.
   * @param courseId The course context for the analytics.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to an array of AI-generated insights.
   */
  public static async getPerformanceHighlights(
    courseId: string,
    studentId: string
  ): Promise<FeedbackResponseSchema> {
    logger.debug(
      `Checking for cached performance highlights for user ${studentId}.`
    );
    const cachedInsights =
      await AnalyticsRepository.getLatestInsights(studentId);

    if (
      cachedInsights &&
      differenceInHours(new Date(), cachedInsights.generatedAt) < 24
    ) {
      logger.info(
        `Returning cached performance highlights for user ${studentId}.`
      );
      return cachedInsights.insights;
    }

    logger.info(`Generating new performance highlights for user ${studentId}.`);
    const { performanceChart, classRanking } =
      await this.getComparisonAnalyticsData(courseId, studentId);

    try {
      if (performanceChart.length === 0) {
        throw new Error('Not enough data to generate highlights.');
      }

      const totalYourScore = performanceChart.reduce(
        (sum, item) => sum + item.yourScore,
        0
      );
      const totalClassAverage = performanceChart.reduce(
        (sum, item) => sum + item.classAverage,
        0
      );
      const averagePerformance =
        totalClassAverage > 0 ? totalYourScore / totalClassAverage : 1;
      const bestCourse = performanceChart.reduce((best, current) =>
        current.yourScore > best.yourScore ? current : best
      );

      const context = {
        rank: classRanking.rank,
        totalStudents: classRanking.totalStudents,
        bestCourse: bestCourse
          ? { subject: bestCourse.subject, yourScore: bestCourse.yourScore }
          : null,
        averagePerformance,
      };

      const systemInstruction =
        AIPrompt.buildPerformanceHighlightsPrompt(context);
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Generate the performance highlights now.' }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: feedbackResponseSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error('No response text from AI provider.');

      const parsed = JSON.parse(text);
      const validated = feedbackResponseSchemaZod.parse(parsed);

      await AnalyticsRepository.upsertInsights(studentId, validated);
      logger.info(
        `Saved new AI performance highlights to cache for user ${studentId}`
      );

      return validated;
    } catch (error) {
      logger.error(
        'Failed to generate AI performance highlights. Returning default. %o',
        { error }
      );
      return [
        {
          title: 'Great Effort!',
          description:
            "You're actively participating and completing your assignments. Keep up the great work!",
          level: 'medium',
          actionButtonText: 'View Grades',
        },
        {
          title: 'Keep Growing',
          description:
            'Every assignment is an opportunity to learn. Continue to review your feedback to improve.',
          level: 'low',
          actionButtonText: 'Review Feedback',
        },
        {
          title: 'Stay Consistent',
          description:
            'Consistency is key in learning, and you are on the right track. Keep the momentum going!',
          level: 'low',
          actionButtonText: 'View Schedule',
        },
        {
          title: 'Explore New Topics',
          description:
            'Challenge yourself by exploring a new course or topic to broaden your knowledge.',
          level: 'low',
          actionButtonText: 'Browse Courses',
        },
      ];
    }
  }

  /**
   * Refactored private method to fetch only the numerical data for comparison.
   */
  private static async getComparisonAnalyticsData(
    courseId: string,
    studentId: string
  ) {
    const enrolledCourses =
      await EnrollRepository.findActiveAndCompletedByUserId(studentId);
    if (enrolledCourses.length === 0) {
      throw new NotFoundError('No enrollments found for this student.');
    }
    const courseIds = enrolledCourses.map((e) => e.courseId);

    const [courseAverages, studentGradesMap, classRanking, topStudents] =
      await Promise.all([
        AnalyticsRepository.getCourseAverages(courseIds),
        this.getStudentAverageGrades(studentId, courseIds),
        AnalyticsRepository.getStudentRankInCourse(courseId, studentId),
        AnalyticsRepository.getTopStudentsInCourse(courseId, 5),
      ]);

    const courseDetails = await CourseClient.getCoursesByIds(courseIds);

    const performanceChart = courseIds
      .map((id) => ({
        subject: courseDetails.get(id)?.title || 'Unknown Course',
        yourScore: studentGradesMap.get(id) || 0,
        classAverage: courseAverages.get(id) || 0,
      }))
      .filter((c) => c.yourScore > 0 || c.classAverage > 0);

    const topStudentIds = topStudents.map((s) => s.studentId);
    const userProfiles = await UserClient.getPublicProfiles(topStudentIds);

    const enrichedTopStudents = topStudents.map((student) => ({
      rank: student.rank,
      name: userProfiles.get(student.studentId)?.firstName || 'Anonymous',
      score: student.score,
    }));

    return {
      performanceChart,
      classRanking: {
        rank: classRanking.rank,
        totalStudents: classRanking.totalStudents,
        topStudents: enrichedTopStudents,
      },
    };
  }

  /**
   * Retrieves or generates AI-powered predictive performance analytics for a student.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to the predictive chart data.
   */
  public static async getPredictiveChartData(
    studentId: string
  ): Promise<PredictiveChartData> {
    logger.debug(
      `Checking for cached predictive chart data for user ${studentId}.`
    );
    const cachedData =
      await AnalyticsRepository.getLatestLearningPath(studentId);

    if (
      cachedData &&
      differenceInHours(new Date(), cachedData.generatedAt) < 24
    ) {
      logger.info(
        `Returning cached predictive chart data for user ${studentId}.`
      );
      return cachedData.pathData;
    }

    logger.info(`Generating new predictive chart data for user ${studentId}.`);
    try {
      const gradeHistory = await AnalyticsRepository.getRecentGrades(studentId);
      if (gradeHistory.length < 2) {
        logger.warn(
          `Not enough grade history for user ${studentId} to generate prediction.`
        );
        return []; // Return empty array if not enough data
      }

      const systemInstruction =
        AIPrompt.buildPredictiveChartPrompt(gradeHistory);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          { role: 'user', parts: [{ text: 'Generate the predictions now.' }] },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: predictiveChartResponseSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error('No response text from AI provider.');

      const parsed = JSON.parse(text);
      const validated = predictiveChartDataSchema.parse(parsed.predictions);

      await AnalyticsRepository.upsertLearningPath(studentId, validated);
      logger.info(`Saved new chart predictions to cache for user ${studentId}`);

      return validated;
    } catch (error) {
      logger.error(
        'Failed to generate predictive chart data. Returning empty array.',
        { error }
      );
      return [];
    }
  }

  /**
   * Retrieves or generates AI-powered performance predictions for a student.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to an array of prediction objects.
   */
  public static async getPerformancePredictions(
    studentId: string
  ): Promise<PerformancePrediction[]> {
    logger.debug(
      `Checking for cached performance predictions for user ${studentId}.`
    );

    const cachedData =
      await AnalyticsRepository.getLatestPredictions(studentId);
    if (
      cachedData &&
      differenceInHours(new Date(), cachedData.generatedAt) < 24
    ) {
      logger.info(
        `Returning cached performance predictions for user ${studentId}.`
      );

      return cachedData.predictions;
    }

    logger.info(
      `Generating new performance predictions for user ${studentId}.`
    );

    try {
      const enrolledCourses =
        await EnrollRepository.findActiveAndCompletedByUserId(studentId);
      if (enrolledCourses.length === 0) {
        throw new Error('User is not enrolled in any courses.');
      }

      const courseIds = enrolledCourses.map((e) => e.courseId);
      const assignments =
        await CourseClient.getAssignmentsForCourses(courseIds);

      const { totalSubmissions, averageGrade, onTimeRate } =
        await AnalyticsRepository.getOverallStudentAnalytics(
          studentId,
          assignments
        );

      if (totalSubmissions < 3) {
        throw new Error('Not enough data to generate predictions.');
      }

      const context = { totalSubmissions, averageGrade, onTimeRate };
      const systemInstruction =
        AIPrompt.buildPerformancePredictionPrompt(context);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Generate the performance predictions now.' }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: performancePredictionResponseSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error('No response text from AI provider.');

      const parsed = JSON.parse(text);
      const validated = performancePredictionSchema.parse(parsed.predictions);

      await AnalyticsRepository.upsertPredictions(studentId, validated);
      logger.info(
        `Saved new performance predictions to cache for user ${studentId}`
      );

      return validated;
    } catch (error) {
      logger.error(
        'Failed to generate performance predictions. Returning default. %o',
        { error }
      );

      return [
        {
          title: 'Grade Trajectory',
          description:
            'Analysis requires more data. Complete a few more assignments to unlock your grade prediction.',
          highlighted: true,
        },
        {
          title: 'Risk Assessment',
          description:
            'Keep up with your coursework to stay on the path to success.',
        },
        {
          title: 'Optimization Opportunity',
          description:
            'Reviewing feedback on past assignments is a great way to improve.',
        },
      ];
    }
  }

  /**
   * Retrieves or generates AI-powered learning recommendations for a student.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to an array of recommendation objects.
   */
  public static async getLearningRecommendations(
    studentId: string
  ): Promise<LearningRecommendation[]> {
    logger.debug(
      `Checking for cached learning recommendations for user ${studentId}.`
    );
    const cachedData =
      await AnalyticsRepository.getLearningLatestRecommendations(studentId);

    if (
      cachedData &&
      differenceInHours(new Date(), cachedData.generatedAt) < 24
    ) {
      logger.info(
        `Returning cached learning recommendations for user ${studentId}.`
      );

      return cachedData.recommendations;
    }

    logger.info(
      `Generating new learning recommendations for user ${studentId}.`
    );

    try {
      const [gradeDistribution, studyTime] = await Promise.all([
        AnalyticsRepository.getOverallGradeDistribution(studentId),
        AnalyticsRepository.getStudyTimeAnalytics(studentId),
      ]);

      if (gradeDistribution.length === 0) {
        throw new Error('Not enough grade data to generate recommendations.');
      }

      const context = {
        gradeDistribution,
        peakStudyDays: studyTime.peakDays,
        peakStudyHours: studyTime.peakHours,
      };

      const systemInstruction =
        AIPrompt.buildLearningRecommendationPrompt(context);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Generate the learning recommendations now.' }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: learningRecommendationResponseSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error('No response text from AI provider.');

      const parsed = JSON.parse(text);
      const validated = learningRecommendationSchema.parse(
        parsed.recommendations
      );

      await AnalyticsRepository.upsertLearningRecommendations(
        studentId,
        validated
      );

      logger.info(
        `Saved new learning recommendations to cache for user ${studentId}`
      );

      return validated;
    } catch (error) {
      logger.error(
        'Failed to generate learning recommendations. Returning default: %o',
        { error }
      );

      return [
        {
          title: 'Review Weaker Subjects',
          description:
            'Focus on topics where your grades are lowest to see the biggest improvement.',
        },
        {
          title: 'Establish a Routine',
          description:
            'Studying at the same time each day can help build a strong habit.',
        },
        {
          title: 'Engage with Peers',
          description:
            'Join a study group or discussion forum to deepen your understanding.',
        },
      ];
    }
  }

  /**
   * Retrieves and calculates the overall module completion statistics for a student.
   * @param studentId The ID of the student.
   * @returns An array of objects formatted for the module completion pie chart.
   */
  public static async getModuleCompletionStats(
    studentId: string
  ): Promise<ModuleCompletionData> {
    logger.info(`Fetching module completion stats for student ${studentId}`);

    try {
      const { completed, inProgress, notStarted, total } =
        await AnalyticsRepository.getOverallModuleCompletion(studentId);

      if (total === 0) {
        return [];
      }

      return [
        {
          status: 'Completed' as const,
          value: Math.round((completed / total) * 100),
          fill: 'var(--chart-1)',
        },
        {
          status: 'In Progress' as const,
          value: Math.round((inProgress / total) * 100),
          fill: 'var(--chart-2)',
        },
        {
          status: 'Not Started' as const,
          value: Math.round((notStarted / total) * 100),
          fill: 'var(--chart-4)',
        },
      ].filter((item) => item.value > 0);
    } catch (error) {
      logger.error(
        `Failed to get module completion stats for student ${studentId} : %o`,
        { error }
      );

      return [];
    }
  }

  /**
   * Retrieves or generates AI-powered progress insights for a student.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to an array of insight objects.
   */
  public static async getAIProgressInsights(
    studentId: string
  ): Promise<AIProgressInsight[]> {
    logger.debug(
      `Checking for cached progress insights for user ${studentId}.`
    );

    const cachedData =
      await AnalyticsRepository.getLatestProgressInsights(studentId);

    if (
      cachedData &&
      differenceInHours(new Date(), cachedData.generatedAt) < 24
    ) {
      logger.info(`Returning cached progress insights for user ${studentId}.`);

      return cachedData.insights;
    }

    logger.info(`Generating new progress insights for user ${studentId}.`);

    try {
      const [moduleCompletion, studyTrend] = await Promise.all([
        AnalyticsRepository.getOverallModuleCompletion(studentId),
        AnalyticsRepository.getWeeklyStudyTrend(studentId),
      ]);

      if (moduleCompletion.total === 0 || studyTrend.length < 2) {
        throw new Error('Not enough data to generate insights.');
      }

      const totalHours = studyTrend.reduce(
        (sum, week) => sum + week.studyHours,
        0
      );
      const averageHours = totalHours / studyTrend.length;
      const variance =
        studyTrend
          .map((w) => Math.pow(w.studyHours - averageHours, 2))
          .reduce((sum, v) => sum + v, 0) / studyTrend.length;
      const stdDev = Math.sqrt(variance);

      const context = {
        completion: {
          completed: Math.round(
            (moduleCompletion.completed / moduleCompletion.total) * 100
          ),
          inProgress: Math.round(
            (moduleCompletion.inProgress / moduleCompletion.total) * 100
          ),
          notStarted: Math.round(
            (moduleCompletion.notStarted / moduleCompletion.total) * 100
          ),
        },
        studyTrend: {
          averageHours: averageHours,
          isConsistent: stdDev < averageHours / 2,
        },
      };

      const systemInstruction = AIPrompt.buildProgressInsightsPrompt(context);

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Generate the progress insights now.' }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: aiProgressInsightsResponseSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error('No response text from AI provider.');

      const parsed = JSON.parse(text);
      const validated = aiProgressInsightArraySchema.parse(parsed.insights);

      await AnalyticsRepository.upsertProgressInsights(studentId, validated);

      logger.info(`Saved new progress insights to cache for user ${studentId}`);

      return validated;
    } catch (error) {
      logger.error(
        'Failed to generate AI progress insights. Returning default. %o',
        { error }
      );

      return [
        {
          title: 'Start Your Journey',
          description:
            'Complete a few lessons and assignments to unlock personalized AI insights about your progress.',
          highlighted: true,
        },
        {
          title: 'Track Your Time',
          description:
            'As you study, we will analyze your patterns to help you find your most effective learning times.',
        },
        {
          title: 'Build Momentum',
          description:
            'Consistency is key. Try to complete at least one lesson each day to build a strong study habit.',
        },
      ];
    }
  }

  /**
   * Aggregates data from multiple services to build a chronological learning timeline.
   * @param studentId The ID of the student.
   * @param cookie The auth cookie to pass to other services.
   * @returns A sorted array of learning milestones.
   */
  public static async getLearningMilestones(
    studentId: string,
    cookie: string
  ): Promise<Milestone[]> {
    logger.info(`Fetching learning milestones for student ${studentId}`);

    try {
      const courseProgress =
        await AnalyticsRepository.findCourseProgressMilestones(studentId);
      const enrolledCourseIds = courseProgress.map((p) => p.courseId);

      const [upcomingAssignments, upcomingEvents] = await Promise.all([
        CourseClient.getUpcomingAssignmentsForCourses(enrolledCourseIds),
        CommunityClient.getMyUpcomingEvents(cookie),
      ]);

      const courseMilestones: Milestone[] = courseProgress
        .filter((p) => p.status === 'completed' || p.status === 'active')
        .map((p) => ({
          title: p.courseTitle,
          date: new Date(p.date).toISOString(),
          status: p.status === 'completed' ? 'completed' : 'in-progress',
          type: 'course',
        }));

      const assignmentMilestones: Milestone[] = upcomingAssignments
        .filter(
          (a): a is { id: string; title: string; dueDate: string } =>
            !!a.dueDate
        )
        .map((a) => ({
          title: a.title,
          date: new Date(a.dueDate).toISOString(),
          status: 'upcoming',
          type: 'assignment',
        }));

      const eventMilestones: Milestone[] = upcomingEvents
        .filter(
          (e): e is { id: string; title: string; date: string } => !!e.date
        )
        .map((e) => ({
          title: e.title,
          date: new Date(e.date).toISOString(),
          status: 'upcoming',
          type: 'event',
        }));

      const allMilestones = [
        ...courseMilestones,
        ...assignmentMilestones,
        ...eventMilestones,
      ];

      allMilestones.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return allMilestones;
    } catch (error) {
      logger.error(
        `Failed to get learning milestones for student ${studentId}`,
        { error }
      );
      return [];
    }
  }

  /**
   * Retrieves and formats the daily study habits for a student.
   * @param studentId The ID of the student.
   * @returns An array of daily habit data for the chart.
   */
  public static async getStudyHabits(studentId: string): Promise<StudyHabit[]> {
    logger.info(`Fetching study habits for student ${studentId}`);
    try {
      const dailyData =
        await AnalyticsRepository.getDailyStudyHabits(studentId);

      const formattedData = dailyData.map((item) => {
        const maxMinutes = 4 * 60;
        const efficiency = Math.min(
          Math.round((item.totalMinutes / maxMinutes) * 100),
          100
        );
        const focus = Math.max(
          0,
          efficiency - faker.number.int({ min: 5, max: 15 })
        );
        return {
          day: item.day,
          efficiency,
          focus,
        };
      });

      return formattedData;
    } catch (error) {
      logger.error(`Failed to get study habits for student ${studentId}: %o`, {
        error,
      });

      return [];
    }
  }
}
