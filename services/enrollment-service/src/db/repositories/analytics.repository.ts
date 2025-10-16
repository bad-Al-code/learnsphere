import {
  and,
  avg,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  sql,
  sum,
} from 'drizzle-orm';
import { db } from '..';
import logger from '../../config/logger';
import { BadRequestError } from '../../errors';
import { AssignmentResponse } from '../../features/ai/responseSchema/assignmentRecommendationResponse.schema';
import {
  AIProgressInsight,
  LearningEfficiency,
  LearningRecommendation,
  PerformancePrediction,
  PredictiveChartData,
} from '../../features/ai/schema';
import { FeedbackResponseSchema } from '../../features/ai/schema/feedback.schema';
import {
  Assignment,
  GetMyGradesQuery,
  GradeDistributionItem,
  gradeDistributionItemSchema,
  gradeRowSchema,
  MonthlyTrend,
  monthlyTrendSchema,
  OnTimeSubmissionData,
  onTimeSubmissionDataSchema,
  rawAnalyticsDataSchema,
  StudyHabit,
} from '../../schema';
import { GradeRow } from '../../types';
import {
  AIInsight,
  aiInsights,
  aiLearningEfficiency,
  AILearningEfficiency,
  AILearningPath,
  aiLearningPaths,
  AILearningRecommendation,
  aiLearningRecommendations,
  AIPerformancePrediction,
  aiPerformancePredictions,
  AIProgressInsightEntry,
  aiProgressInsights,
  AIStudyHabitEntry,
  aiStudyHabits,
  AIStudyRecommendation,
  aiStudyRecommendations,
  courseActivityLogs,
  courses,
  dailyActivity,
  enrollments,
  lessonSessions,
  NewActivityLog,
  NewLessonSession,
  NewReportJob,
  reportJobs,
  StudentGrade,
  studentGrades,
} from '../schema';

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
        avgScore: sql<number>`AVG(student_grades.grade)::numeric(5, 2)`.as(
          'avg_score'
        ),
      })
      .from(enrollments)
      .leftJoin(
        studentGrades,
        and(
          eq(enrollments.courseId, studentGrades.courseId),
          eq(enrollments.userId, studentGrades.studentId)
        )
      )
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
        studentCount: countDistinct(enrollments.userId),
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds))
      .groupBy(enrollments.courseId);

    return result.map((item) => ({
      ...item,
      averageCompletion: parseFloat(item.averageCompletion?.toString() || '0'),
    }));
  }

  /**
   * Fetches the user IDs for all students enrolled in an instructor's courses.
   * @param instructorId The ID of the instructor.
   * @returns An array of unique student UUIDs.
   */
  public static async getStudentIdsForInstructor(
    instructorId: string
  ): Promise<string[]> {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return [];
    }
    const courseIds = instructorCourses.map((c) => c.id);

    const results = await db
      .selectDistinct({ userId: enrollments.userId })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds));

    return results.map((r) => r.userId);
  }

  /**
   * @async
   * @description Finds the top 5 students enrollments for an instructor based on progress percentage.
   * @param instructorId The UUID of instructor.
   * @returns { Promise<Array<{userId: string, courseId: string, progress: string, lastActive: Date}>>} A promise that resolves to an array of the top 5 students enrollments.
   */
  public static async getTopStudentsForInstructor(instructorId: string) {
    const instructorCourses = await db
      .select({
        id: courses.id,
      })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];

    const courseIds = instructorCourses.map((c) => c.id);

    const result = await db
      .select({
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        progress: enrollments.progressPercentage,
        lastActive: enrollments.lastAccessedAt,
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds))
      .orderBy(
        desc(enrollments.progressPercentage),
        desc(enrollments.lastAccessedAt)
      )
      .limit(5);

    return result;
  }

  /**
   * Aggregates student progress for each module across all of an instructor's courses.
   * @param instructorId - The UUID of the instructor.
   * @returns A promise that resolves to an array of progress stats for each module.
   */
  public static async getModuleProgressForInstructor(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];
    const courseIds = instructorCourses.map((c) => c.id);

    const result = await db.execute(sql`
      WITH CourseModules AS (
        SELECT
          c.id AS course_id,
          (m.value ->> 'id')::uuid AS module_id
        FROM
          courses c,
          jsonb_array_elements(
            (SELECT course_structure -> 'modules' FROM enrollments WHERE course_id = c.id LIMIT 1)
          ) m
        WHERE c.id IN ${courseIds}
      ),
      StudentModuleProgress AS (
        SELECT
          e.user_id,
          cm.module_id,
          (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(m.value -> 'lessonIds') AS lesson_id
            WHERE lesson_id.value IN (SELECT jsonb_array_elements_text(e.progress -> 'completedLessons'))
          ) AS completed_lessons,
          jsonb_array_length(m.value -> 'lessonIds') AS total_lessons
        FROM
          enrollments e
        JOIN
          CourseModules cm ON e.course_id = cm.course_id
        CROSS JOIN
          jsonb_array_elements(e.course_structure -> 'modules') WITH ORDINALITY AS m(value, "order")
        WHERE e.course_id IN ${courseIds} AND (m.value ->> 'id')::uuid = cm.module_id
      )
      SELECT
        module_id,
        SUM(CASE WHEN completed_lessons = total_lessons AND total_lessons > 0 THEN 1 ELSE 0 END)::int AS completed,
        SUM(CASE WHEN completed_lessons > 0 AND completed_lessons < total_lessons THEN 1 ELSE 0 END)::int AS "inProgress",
        SUM(CASE WHEN completed_lessons = 0 THEN 1 ELSE 0 END)::int AS "notStarted"
      FROM
        StudentModuleProgress
      GROUP BY
        module_id;
    `);

    return result.rows as {
      module_id: string;
      completed: number;
      inProgress: number;
      notStarted: number;
    }[];
  }

  /**
   * @async
   * @description Retrieves the daily activity for an instructor over the last 7 days.
   * @param instructorId - The UUID of the instructor.
   * @returns  A promise that resolves with the weekly activity data.
   */
  public static async getWeeklyActivity(instructorId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return db
      .select()
      .from(dailyActivity)
      .where(
        and(
          eq(dailyActivity.instructorId, instructorId),
          gte(dailyActivity.date, sevenDaysAgo.toISOString().split('T')[0])
        )
      )
      .orderBy(dailyActivity.date);
  }

  /**
   * @async
   * @description Fetches raw data needed for calculating learning analytics for an instructor.
   * @param instructorId - The UUID of the instructor.
   * @returns An object containing data for timeliness and resource usage.
   */
  public static async getLearningAnalyticsRawData(instructorId: string) {
    const instructorCourses = await db
      .select({
        id: courses.id,
      })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return { timelinessData: [], resourceData: [] };
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const timelinessData = await db
      .select({
        submittedAt: enrollments.updatedAt,
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds));

    const resourceData = await db
      .select({
        downloads: sql<number>`COUNT(*) * 5`, // NOTE: placeholder
      })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds));

    return { timelinessData, resourceData };
  }

  /**
   * Calculates the total number of discussion posts for an instructor's courses.
   * @param instructorId The ID of the instructor.
   * @returns The total number of discussion posts.
   */
  public static async getTotalDiscussionsByInstructor(
    instructorId: string
  ): Promise<number> {
    const [result] = await db
      .select({
        total: sum(dailyActivity.discussions),
      })
      .from(dailyActivity)
      .where(eq(dailyActivity.instructorId, instructorId));

    return parseInt(result?.total || '0', 10);
  }

  /**
   * Calculates statistics for a single course.
   * @param courseId The ID of the course.
   * @returns An object with total students and average completion rate.
   */
  public static async getStatsForCourse(courseId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const currentStatsQuery = db
      .select({
        totalStudents: countDistinct(enrollments.userId),
        avgCompletion: avg(enrollments.progressPercentage),
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    const previousCompletionQuery = db
      .select({
        avgCompletion: avg(enrollments.progressPercentage),
      })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.courseId, courseId),
          lt(enrollments.updatedAt, thirtyDaysAgo),
          gte(enrollments.updatedAt, sixtyDaysAgo)
        )
      );

    const [[currentStats], [previousStats]] = await Promise.all([
      currentStatsQuery,
      previousCompletionQuery,
    ]);

    return {
      totalStudents: currentStats.totalStudents || 0,
      avgCompletion: parseFloat(currentStats.avgCompletion || '0'),
      previousAvgCompletion: parseFloat(previousStats?.avgCompletion || '0'),
    };
  }

  /**
   * Finds all enrollments for a course, sorted by progress and grade.
   * @param courseId The ID of the course.
   * @returns A promise that resolves to an array of enrollments with grade data.
   */
  public static async getStudentPerformanceForCourse(courseId: string) {
    // This query joins enrollments with the locally replicated student grades
    const result = await db
      .select({
        userId: enrollments.userId,
        progressPercentage: enrollments.progressPercentage,
        averageGrade: sql<number>`AVG(${studentGrades.grade})`.as(
          'average_grade'
        ),
      })
      .from(enrollments)
      .leftJoin(
        studentGrades,
        and(
          eq(enrollments.userId, studentGrades.studentId),
          eq(enrollments.courseId, studentGrades.courseId)
        )
      )
      .where(eq(enrollments.courseId, courseId))
      .groupBy(enrollments.id)
      .orderBy(
        desc(
          sql`(${enrollments.progressPercentage} + COALESCE(AVG(${studentGrades.grade}), 0)) / 2`
        )
      );

    return result;
  }

  /**
   * Creates a new course activity log entry.
   * @param data The data for the new log entry.
   */
  public static async createActivityLog(data: NewActivityLog): Promise<void> {
    await db.insert(courseActivityLogs).values(data);
  }

  /**
   * Calculates various time-based and aggregate stats from the activity log for a single course.
   * @param courseId The ID of the course.
   * @returns Enrollment counts, discussion totals, and recent activity
   */
  public static async getActivityStatsForCourse(courseId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const enrollmentsLast30DaysQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          eq(courseActivityLogs.courseId, courseId),
          eq(courseActivityLogs.activityType, 'enrollment'),
          gte(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const enrollmentsPrevious30DaysQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          eq(courseActivityLogs.courseId, courseId),
          eq(courseActivityLogs.activityType, 'enrollment'),
          gte(courseActivityLogs.createdAt, sixtyDaysAgo),
          lt(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const totalDiscussionsQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          eq(courseActivityLogs.courseId, courseId),
          eq(courseActivityLogs.activityType, 'discussion_post')
        )
      );

    const recentActivityQuery = db.query.courseActivityLogs.findMany({
      where: eq(courseActivityLogs.courseId, courseId),
      with: {
        enrollment: {
          columns: {
            lastAccessedAt: true,
          },
        },
      },
      orderBy: [desc(courseActivityLogs.createdAt)],
      limit: 5,
    });

    const resourceDownloadsLast30DaysQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          eq(courseActivityLogs.courseId, courseId),
          eq(courseActivityLogs.activityType, 'resource_download'),
          gte(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const resourceDownloadsPrevious30DaysQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          eq(courseActivityLogs.courseId, courseId),
          eq(courseActivityLogs.activityType, 'resource_download'),
          gte(courseActivityLogs.createdAt, sixtyDaysAgo),
          lt(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const [
      enrollmentsLast30Days,
      enrollmentsPrevious30Days,
      totalDiscussions,
      recentActivity,
      resourceDownloadsLast30Days,
      resourceDownloadsPrevious30Days,
    ] = await Promise.all([
      enrollmentsLast30DaysQuery,
      enrollmentsPrevious30DaysQuery,
      totalDiscussionsQuery,
      recentActivityQuery,
      resourceDownloadsLast30DaysQuery,
      resourceDownloadsPrevious30DaysQuery,
    ]);

    return {
      enrollmentsLast30Days: enrollmentsLast30Days[0].value,
      enrollmentsPrevious30Days: enrollmentsPrevious30Days[0].value,
      totalDiscussions: totalDiscussions[0].value,
      recentActivity,
      resourceDownloadsLast30Days: resourceDownloadsLast30Days[0].value,
      resourceDownloadsPrevious30Days: resourceDownloadsPrevious30Days[0].value,
    };
  }

  /**
   * Calculates the completion rate for each module in a given course.
   * @param courseId The ID of the course.
   * @returns A promise that resolves to an array of objects, each with a moduleId and its completion rate.
   */
  public static async getModuleCompletionRates(courseId: string) {
    const query = sql`
      WITH ModuleLessons AS (
        SELECT
          id AS enrollment_id,
          (module ->> 'id')::uuid AS module_id,
          jsonb_array_elements_text(module -> 'lessonIds') AS lesson_id
        FROM
          enrollments,
          jsonb_array_elements(course_structure -> 'modules') AS module
        WHERE
          course_id = ${courseId}
      ),
      CompletedLessons AS (
        SELECT
          id AS enrollment_id,
          jsonb_array_elements_text(progress -> 'completedLessons') AS lesson_id
        FROM
          enrollments
        WHERE
          course_id = ${courseId}
      ),
      ModuleCompletion AS (
        SELECT
          ml.enrollment_id, -- Keep enrollment_id for the final join
          ml.module_id,
          COUNT(ml.lesson_id) AS total_lessons,
          COUNT(cl.lesson_id) AS completed_lessons
        FROM
          ModuleLessons ml
        LEFT JOIN
          CompletedLessons cl ON ml.enrollment_id = cl.enrollment_id AND ml.lesson_id = cl.lesson_id
        GROUP BY
          ml.enrollment_id, ml.module_id
      )

      SELECT
        mc.module_id,
        (AVG(CASE WHEN mc.total_lessons > 0 THEN (mc.completed_lessons::decimal / mc.total_lessons) ELSE 0 END) * 100)::numeric(5, 2) AS completion_rate,
        AVG(mg.avg_grade)::numeric(5, 2) AS average_grade
      FROM
        ModuleCompletion mc
      LEFT JOIN
        (
          SELECT
            module_id,
            student_id,
            AVG(grade) as avg_grade
          FROM student_grades
          WHERE course_id = ${courseId}
          GROUP BY module_id, student_id
        ) AS mg ON mc.module_id = mg.module_id AND mc.enrollment_id = mg.student_id -- Join on student/enrollment ID
      GROUP BY
        mc.module_id
      ORDER BY
        completion_rate DESC
      LIMIT 5;
    `;

    const result = await db.execute(query);

    return result.rows as {
      module_id: string;
      completion_rate: string;
      average_grade: string | null;
    }[];
  }

  /**
   * Calculates the average session duration in minutes for a specific course.
   * @param courseId The ID of the course.
   * @returns The average duration in minutes, or 0 if no sessions are found.
   */
  public static async getAverageSessionTime(courseId: string): Promise<number> {
    const [result] = await db
      .select({
        avgDuration: avg(lessonSessions.durationMinutes),
      })
      .from(lessonSessions)
      .where(eq(lessonSessions.courseId, courseId));

    return Math.round(parseFloat(result?.avgDuration || '0'));
  }

  /**
   * @description Creates a new lesson session record in the database.
   * This method is typically called when a user begins interacting with a lesson.
   *
   * @param {NewLessonSession} data - An object containing the initial details of the session,
   * such as sessionId, userId, lessonId, and startedAt.
   * @returns {Promise<void>} A promise that resolves when the session has been successfully created.
   */
  public static async startLessonSession(
    data: NewLessonSession
  ): Promise<void> {
    await db.insert(lessonSessions).values(data);
  }

  /**
   * @description Updates an existing lesson session to mark its completion.
   * This sets the session's end time and calculated duration.
   *
   * @param {string} sessionId - The unique identifier for the session to be ended.
   * @param {Date} endedAt - The timestamp marking when the session concluded.
   * @param {number} duration - The total duration of the session in minutes.
   * @returns {Promise<void>} A promise that resolves when the session has been successfully updated.
   */
  public static async endLessonSession(
    sessionId: string,
    endedAt: Date,
    duration: number
  ): Promise<void> {
    await db
      .update(lessonSessions)
      .set({ endedAt, durationMinutes: duration })
      .where(eq(lessonSessions.sessionId, sessionId));
  }

  public static async findLessonSessionBySessionId(sessionId: string) {
    return await db.query.lessonSessions.findFirst({
      where: eq(lessonSessions.sessionId, sessionId),
    });
  }

  /**
   * Calculates the total time spent in minutes for each module in a course.
   * @param courseId The ID of the course.
   * @returns An array of objects, each containing a moduleId and the total time spent.
   */
  public static async getTotalTimeSpentPerModule(courseId: string) {
    const result = await db
      .select({
        moduleId: lessonSessions.moduleId,
        totalMinutes: sum(lessonSessions.durationMinutes),
      })
      .from(lessonSessions)
      .where(eq(lessonSessions.courseId, courseId))
      .groupBy(lessonSessions.moduleId);

    return result.map((row) => ({
      moduleId: row.moduleId,
      timeSpent: parseInt(row.totalMinutes || '0', 10),
    }));
  }

  /**
   * Calculates high-level statistics for an instructor across all their courses.
   * @param instructorId The ID of the instructor.
   * @returns An object with average completion rate and average grade.
   */
  public static async getOverallInstructorStats(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return {
        current: { avgCompletion: '0', avgGrade: null },
        previous: { avgCompletion: '0', avgGrade: null },
      };
    }

    const courseIds = instructorCourses.map((c) => c.id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const getStatsForPeriod = async (startDate: Date, endDate?: Date) => {
      const conditions = [
        inArray(enrollments.courseId, courseIds),
        gte(enrollments.updatedAt, startDate),
      ];

      if (endDate) {
        conditions.push(lt(enrollments.updatedAt, endDate));
      }

      const [stats] = await db
        .select({
          avgCompletion: avg(enrollments.progressPercentage),
          avgGrade: avg(studentGrades.grade),
        })
        .from(enrollments)
        .leftJoin(
          studentGrades,
          and(
            eq(enrollments.courseId, studentGrades.courseId),
            eq(enrollments.userId, studentGrades.studentId)
          )
        )
        .where(and(...conditions));

      return {
        avgCompletion: parseFloat(stats.avgCompletion || '0').toFixed(1),
        avgGrade: stats.avgGrade ? parseFloat(stats.avgGrade) : null,
      };
    };

    const [currentPeriodStats, previousPeriodStats] = await Promise.all([
      getStatsForPeriod(thirtyDaysAgo),
      getStatsForPeriod(sixtyDaysAgo, thirtyDaysAgo),
    ]);

    return { current: currentPeriodStats, previous: previousPeriodStats };
  }

  /**
   * Calculates total engagement activities for an instructor over two 30-day periods.
   * @param instructorId The ID of the instructor.
   * @returns An object with activity counts for the current and previous periods.
   */
  public static async getEngagementTrend(instructorId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));
    if (instructorCourses.length === 0) {
      return { currentPeriodActivity: 0, previousPeriodActivity: 0 };
    }
    const courseIds = instructorCourses.map((c) => c.id);

    const currentPeriodQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          inArray(courseActivityLogs.courseId, courseIds),
          gte(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const previousPeriodQuery = db
      .select({ value: count() })
      .from(courseActivityLogs)
      .where(
        and(
          inArray(courseActivityLogs.courseId, courseIds),
          gte(courseActivityLogs.createdAt, sixtyDaysAgo),
          lt(courseActivityLogs.createdAt, thirtyDaysAgo)
        )
      );

    const [[currentPeriod], [previousPeriod]] = await Promise.all([
      currentPeriodQuery,
      previousPeriodQuery,
    ]);

    return {
      currentPeriodActivity: currentPeriod.value,
      previousPeriodActivity: previousPeriod.value,
    };
  }

  /**
   * Calculates the distribution of grades for all of an instructor's students.
   * @param instructorId The ID of the instructor.
   * @returns An array of objects, each with a grade bracket and the count of students.
   */
  public static async getGradeDistribution(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];

    const query = sql`
    SELECT
      CASE
        WHEN avg_grade >= 90 THEN 'A'
        WHEN avg_grade >= 80 THEN 'B'
        WHEN avg_grade >= 70 THEN 'C'
        WHEN avg_grade >= 60 THEN 'D'
        ELSE 'F'
      END AS grade_bracket,
      COUNT(student_id) AS student_count
    FROM (
      SELECT student_id, AVG(grade) AS avg_grade
      FROM student_grades
      WHERE course_id IN (
        SELECT id FROM courses WHERE instructor_id = ${instructorId}
      )
      GROUP BY student_id
    ) AS student_averages
    GROUP BY grade_bracket
    ORDER BY grade_bracket;
  `;

    const result = await db.execute<GradeRow>(query);

    return result.rows.map((row) => ({
      grade: row.grade_bracket,
      count: parseInt(row.student_count, 10),
    }));
  }

  /**
   * Gets a ranked list of all students for a given instructor based on a combined
   * score of their progress and average grade.
   * @param instructorId The ID of the instructor.
   * @returns A promise that resolves to a sorted array of student performance data.
   */
  public static async getStudentPerformanceOverview(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];

    const courseIds = instructorCourses.map((c) => c.id);

    const result = await db
      .select({
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        progressPercentage: enrollments.progressPercentage,
        lastActive: enrollments.lastAccessedAt,
        averageGrade: sql<number>`AVG(student_grades.grade)::numeric(5, 2)`.as(
          'average_grade'
        ),
      })
      .from(enrollments)
      .leftJoin(
        studentGrades,
        and(
          eq(enrollments.userId, studentGrades.studentId),
          eq(enrollments.courseId, studentGrades.courseId)
        )
      )
      .where(inArray(enrollments.courseId, courseIds))
      .groupBy(enrollments.id)
      .orderBy(
        desc(
          sql`(${enrollments.progressPercentage} + COALESCE(AVG(${studentGrades.grade}), 0)) / 2`
        )
      );

    return result;
  }

  /**
   * Calculates the distribution of different engagement activities for an instructor.
   * @param instructorId The ID of the instructor.
   * @returns An array of objects, each with an activity type and its total count.
   */
  public static async getEngagementDistribution(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) return [];

    const courseIds = instructorCourses.map((c) => c.id);

    const result = await db
      .select({
        activity: courseActivityLogs.activityType,
        count: count(courseActivityLogs.id),
      })
      .from(courseActivityLogs)
      .where(inArray(courseActivityLogs.courseId, courseIds))
      .groupBy(courseActivityLogs.activityType);

    return result;
  }

  /**
   * Create a new report job in the database
   * @param data - The data for the new report job
   * @returns The newly created report job record
   */
  public static async createReportJob(data: NewReportJob) {
    const [job] = await db.insert(reportJobs).values(data).returning();

    return job;
  }

  public static async updateReportJobStatus(
    jobId: string,
    status: 'completed' | 'failed',
    fileUrl?: string,
    errorMessage?: string
  ): Promise<void> {
    await db
      .update(reportJobs)
      .set({
        status,
        fileUrl: fileUrl || null,
        errorMessage: errorMessage || null,
        updatedAt: new Date(),
      })
      .where(eq(reportJobs.id, jobId));
  }

  /**
   * Calculates the overall average grade for a student in the current and previous periods.
   * - Current period: last 30 days.
   * - Previous period: 30–60 days ago.
   * @param studentId - The unique identifier of the student.
   * @returns An object with the average grade for the current and previous periods.
   * - `current`: Average grade over the last 30 days, or `null` if no grades exist.
   * - `previous`: Average grade from 30–60 days ago, or `null` if no grades exist.
   */
  public static async getOverallAverageGradeForStudent(
    studentId: string
  ): Promise<{ current: number | null; previous: number | null }> {
    const thirtyDaysAgo = new Date(
      new Date().setDate(new Date().getDate() - 30)
    );
    const sixtyDaysAgo = new Date(
      new Date().setDate(new Date().getDate() - 60)
    );

    const currentPeriodQuery = db
      .select({ averageGrade: avg(studentGrades.grade) })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.studentId, studentId),
          gte(studentGrades.gradedAt, thirtyDaysAgo)
        )
      );

    const previousPeriodQuery = db
      .select({ averageGrade: avg(studentGrades.grade) })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.studentId, studentId),
          lt(studentGrades.gradedAt, thirtyDaysAgo),
          gte(studentGrades.gradedAt, sixtyDaysAgo)
        )
      );

    const [[currentResult], [previousResult]] = await Promise.all([
      currentPeriodQuery,
      previousPeriodQuery,
    ]);

    return {
      current: currentResult?.averageGrade
        ? parseFloat(currentResult.averageGrade)
        : null,
      previous: previousResult?.averageGrade
        ? parseFloat(previousResult.averageGrade)
        : null,
    };
  }

  /**
   * Calculates a user's study streak based on consecutive daily activity.
   * @param userId The ID of the user.
   * @returns The number of consecutive days of activity.
   */
  public static async calculateStudyStreak(userId: string): Promise<number> {
    const result = await db.execute(sql`
      WITH UserActivityDates AS (
        SELECT DISTINCT created_at::date AS activity_date
        FROM course_activity_logs
        WHERE user_id = ${userId}
      ),
      DateGroups AS (
        SELECT
          activity_date,
          activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date ASC))::int AS date_group
        FROM UserActivityDates
      ),
      Streaks AS (
        SELECT
          date_group,
          COUNT(*) AS streak_length,
          MAX(activity_date) AS last_activity_date
        FROM DateGroups
        GROUP BY date_group
        ORDER BY last_activity_date DESC
        LIMIT 1
      )
      SELECT
        CASE
          WHEN last_activity_date >= CURRENT_DATE - INTERVAL '1 day' THEN streak_length::int
          ELSE 0
        END AS streak
      FROM Streaks;
    `);

    if (result.rows.length === 0) {
      return 0;
    }

    return (result.rows[0]?.streak as number) || 0;
  }

  /**
   * Fetches comprehensive leaderboard and stats data for a given user.
   * @param userId The ID of the user requesting the data.
   * @returns A promise that resolves to the raw leaderboard and stats data.
   */
  public static async getLeaderboardAndUserStats(userId: string) {
    const query = sql`
    WITH UserScores AS (
      SELECT 
        e.user_id,
        (AVG(progress_percentage) * 0.6) 
          + (COALESCE(AVG(sg.avg_grade), 70) * 0.4) AS points
      FROM enrollments e
      LEFT JOIN (
        SELECT 
          student_id, 
          course_id, 
          AVG(grade) AS avg_grade
        FROM student_grades
        GROUP BY student_id, course_id
      ) sg 
        ON e.user_id = sg.student_id 
       AND e.course_id = sg.course_id
      WHERE e.status = 'active' OR e.status = 'completed'
      GROUP BY e.user_id
    ),

    RankedUsers AS (
      SELECT 
        user_id,
        points,
        RANK() OVER (ORDER BY points DESC) AS "rank"
      FROM UserScores
    )
    SELECT 
      ru.user_id,
      ru.rank::int,
      ru.points::float,
      (
        SELECT COUNT(*) 
        FROM enrollments 
        WHERE user_id = ru.user_id 
          AND status = 'completed'
      ) AS courses_completed,
      (
        SELECT COUNT(*) 
        FROM student_grades 
        WHERE student_id = ru.user_id
      ) AS assignments_done
    FROM RankedUsers ru
    WHERE ru.rank <= 5 OR ru.user_id = ${userId};
  `;

    const result = await db.execute(query);

    return result.rows as {
      user_id: string;
      rank: number;
      points: number;
      courses_completed: number;
      assignments_done: number;
    }[];
  }

  /**
   * Fetches the total study duration in minutes for a user, grouped by day for the last 7 days.
   * @param userId The ID of the user
   * @returns An array of object, each containing a date and total minutes studied.
   */
  public static async getStudyTrendForUser(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await db
      .select({
        day: sql<string>`TO_CHAR(${lessonSessions.startedAt}, 'YYYY-MM-DD')`,
        totalMinutes: sum(lessonSessions.durationMinutes),
      })
      .from(lessonSessions)
      .where(
        and(
          eq(lessonSessions.userId, userId),
          gte(lessonSessions.startedAt, sevenDaysAgo)
        )
      )
      .groupBy(sql`TO_CHAR(${lessonSessions.startedAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${lessonSessions.startedAt}, 'YYYY-MM-DD')`);

    return result;
  }

  /**
   * Fetches the most recent activity logs across all courses.
   * @param limit The maximum number of activities to return.
   * @returns An array of the latest activity log entries.
   */
  public static async getRecentActivityLogs(limit: number = 5) {
    return db.query.courseActivityLogs.findMany({
      orderBy: [desc(courseActivityLogs.createdAt)],
      limit,
    });
  }

  /**
    Fetches the most recent AI-generated insights for a user.
    @param userId The ID of the user.
    @returns The latest insight record, or undefined if none exists.
  */
  public static async getLatestInsights(
    userId: string
  ): Promise<AIInsight | undefined> {
    return db.query.aiInsights.findFirst({
      where: eq(aiInsights.userId, userId),
      orderBy: [desc(aiInsights.generatedAt)],
    });
  }
  /**
Saves or updates the AI-generated insights for a user.
@param userId The ID of the user.
@param insights The array of insight objects to save.
*/
  public static async upsertInsights(
    userId: string,
    insights: FeedbackResponseSchema
  ): Promise<void> {
    await db
      .insert(aiInsights)
      .values({ userId, insights, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiInsights.userId,
        set: { insights, generatedAt: new Date() },
      });
  }

  /**
   * Fetches the most recent AI-generated study recommendations for a user.
   * @param userId The ID of the user.
   * @returns The latest recommendation record, or undefined if none exists.
   */
  public static async getLatestRecommendations(
    userId: string
  ): Promise<AIStudyRecommendation | undefined> {
    return db.query.aiStudyRecommendations.findFirst({
      where: eq(aiStudyRecommendations.userId, userId),
      orderBy: [desc(aiStudyRecommendations.generatedAt)],
    });
  }
  /**
   * Saves or updates the AI-generated study recommendations for a user.
   * @param userId The ID of the user.
   * @param recommendations The array of recommendation objects to save.
   */
  public static async upsertRecommendations(
    userId: string,
    recommendations: AssignmentResponse
  ): Promise<void> {
    await db
      .insert(aiStudyRecommendations)
      .values({ userId, recommendations, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiStudyRecommendations.userId,
        set: { recommendations, generatedAt: new Date() },
      });
  }

  /**
   * Fetches raw analytics data for a student's assignments in a specific course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @param assignments An array of assignment details from the course-service.
   * @returns A promise that resolves with the raw analytics data.
   */
  public static async getStudentAssignmentAnalytics(
    courseId: string,
    studentId: string,
    assignments: Assignment[]
  ) {
    try {
      const totalSubmissionsQuery = db
        .select({ value: count() })
        .from(studentGrades)
        .where(
          and(
            eq(studentGrades.courseId, courseId),
            eq(studentGrades.studentId, studentId)
          )
        );

      const averageGradeQuery = db
        .select({ value: avg(studentGrades.grade) })
        .from(studentGrades)
        .where(
          and(
            eq(studentGrades.courseId, courseId),
            eq(studentGrades.studentId, studentId)
          )
        );

      const { onTimeRate, onTimeCount } = await this.getOnTimeSubmissionRate(
        courseId,
        studentId,
        assignments
      );

      const [[{ value: totalSubmissions }], [{ value: averageGrade }]] =
        await Promise.all([totalSubmissionsQuery, averageGradeQuery]);

      const rawData = {
        totalSubmissions: Number(totalSubmissions) || 0,
        averageGrade: averageGrade ? parseFloat(String(averageGrade)) : 0,
        onTimeRate,
        onTimeCount,
      };

      return rawAnalyticsDataSchema.parse(rawData);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error(
        `Failed to fetch student assignment analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Fetches overall raw analytics data for a student across all their courses.
   * @param studentId The ID of the student.
   * @param assignments An array of all assignment details for the student's enrolled courses.
   * @returns A promise that resolves with the raw analytics data.
   */
  public static async getOverallStudentAnalytics(
    studentId: string,
    assignments: { id: string; dueDate: Date | null }[]
  ): Promise<{
    totalSubmissions: number;
    averageGrade: number;
    onTimeRate: number;
  }> {
    try {
      const submissions = await db
        .select({
          assignmentId: studentGrades.assignmentId,
          submittedAt: studentGrades.gradedAt,
          grade: studentGrades.grade,
        })
        .from(studentGrades)
        .where(eq(studentGrades.studentId, studentId));

      if (submissions.length === 0) {
        return { totalSubmissions: 0, averageGrade: 0, onTimeRate: 0 };
      }

      const assignmentMap = new Map(assignments.map((a) => [a.id, a.dueDate]));
      let onTimeCount = 0;
      let totalGrade = 0;

      submissions.forEach((sub) => {
        const dueDate = assignmentMap.get(sub.assignmentId);
        if (dueDate && sub.submittedAt && sub.submittedAt <= dueDate) {
          onTimeCount++;
        }

        totalGrade += sub.grade || 0;
      });

      return {
        totalSubmissions: submissions.length,
        averageGrade: totalGrade / submissions.length,
        onTimeRate: onTimeCount / submissions.length,
      };
    } catch (error) {
      logger.error('Error fetching overall student analytics: %o', {
        studentId,
        error,
      });

      throw new Error('Failed to calculate overall student analytics.');
    }
  }

  /**
   * Calculates the on-time submission rate for a student in a specific course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @param assignments An array of assignment details including due dates.
   * @returns The on-time submission rate (0-1) and the count of on-time submissions.
   */
  public static async getOnTimeSubmissionRate(
    courseId: string,
    studentId: string,
    assignments: Assignment[]
  ): Promise<OnTimeSubmissionData> {
    if (!Array.isArray(assignments)) {
      throw new BadRequestError('Assignments must be an array');
    }

    if (assignments.length === 0) {
      return onTimeSubmissionDataSchema.parse({
        onTimeRate: 0,
        onTimeCount: 0,
      });
    }

    try {
      const assignmentMap = new Map(assignments.map((a) => [a.id, a.dueDate]));

      const submissions = await db
        .select({
          assignmentId: studentGrades.assignmentId,
          submittedAt: studentGrades.gradedAt,
        })
        .from(studentGrades)
        .where(
          and(
            eq(studentGrades.courseId, courseId),
            eq(studentGrades.studentId, studentId)
          )
        );

      if (submissions.length === 0) {
        return onTimeSubmissionDataSchema.parse({
          onTimeRate: 0,
          onTimeCount: 0,
        });
      }

      let onTimeCount = 0;
      submissions.forEach((sub) => {
        if (!sub.assignmentId || !sub.submittedAt) {
          return;
        }

        const dueDate = assignmentMap.get(sub.assignmentId);
        if (dueDate && sub.submittedAt <= dueDate) {
          onTimeCount++;
        }
      });

      const result = {
        onTimeRate:
          submissions.length > 0 ? onTimeCount / submissions.length : 0,
        onTimeCount,
      };

      return onTimeSubmissionDataSchema.parse(result);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error(
        `Failed to calculate on-time submission rate: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Retrieves monthly submission counts and average grades for a student in a course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @returns An array of objects with month, submissions, and grade.
   */
  public static async getMonthlySubmissionTrends(
    courseId: string,
    studentId: string
  ): Promise<MonthlyTrend[]> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const result = await db
        .select({
          month: sql<string>`TO_CHAR(date_trunc('month', ${studentGrades.gradedAt}), 'Mon')`,
          submissions: count(studentGrades.id),
          grade: avg(studentGrades.grade),
        })
        .from(studentGrades)
        .where(
          and(
            eq(studentGrades.courseId, courseId),
            eq(studentGrades.studentId, studentId),
            gte(studentGrades.gradedAt, sixMonthsAgo)
          )
        )
        .groupBy(sql`date_trunc('month', ${studentGrades.gradedAt})`)
        .orderBy(sql`date_trunc('month', ${studentGrades.gradedAt})`);

      const trends = result.map((row) => {
        const trend = {
          month: String(row.month || ''),
          submissions: Number(row.submissions) || 0,
          grade: parseFloat(String(row.grade || '0')),
        };

        return monthlyTrendSchema.parse(trend);
      });

      return trends;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error(
        `Failed to fetch monthly submission trends: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Calculates the distribution of grades for a student in a specific course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @returns An array of objects with grade brackets and counts.
   */
  public static async getGradeDistributionForStudent(
    courseId: string,
    studentId: string
  ): Promise<GradeDistributionItem[]> {
    try {
      const query = sql`
        SELECT
          CASE
            WHEN ${studentGrades.grade} >= 97 THEN 'A+'
            WHEN ${studentGrades.grade} >= 93 THEN 'A'
            WHEN ${studentGrades.grade} >= 90 THEN 'A-'
            WHEN ${studentGrades.grade} >= 87 THEN 'B+'
            WHEN ${studentGrades.grade} >= 83 THEN 'B'
            WHEN ${studentGrades.grade} >= 80 THEN 'B-'
            WHEN ${studentGrades.grade} >= 77 THEN 'C+'
            WHEN ${studentGrades.grade} >= 73 THEN 'C'
            WHEN ${studentGrades.grade} >= 70 THEN 'C-'
            WHEN ${studentGrades.grade} >= 60 THEN 'D'
            ELSE 'F'
          END AS grade_bracket,
          COUNT(*) AS student_count
        FROM ${studentGrades}
        WHERE ${studentGrades.courseId} = ${courseId} 
          AND ${studentGrades.studentId} = ${studentId}
        GROUP BY grade_bracket
        ORDER BY
          CASE grade_bracket
            WHEN 'A+' THEN 1 WHEN 'A' THEN 2 WHEN 'A-' THEN 3
            WHEN 'B+' THEN 4 WHEN 'B' THEN 5 WHEN 'B-' THEN 6
            WHEN 'C+' THEN 7 WHEN 'C' THEN 8 WHEN 'C-' THEN 9
            WHEN 'D' THEN 10 ELSE 11
          END;
      `;

      const result = await db.execute<GradeRow>(query);

      const distribution = result.rows.map((row) => {
        const validatedRow = gradeRowSchema.parse(row);
        const item = {
          grade: validatedRow.grade_bracket,
          value: parseInt(String(validatedRow.student_count), 10),
        };

        return gradeDistributionItemSchema.parse(item);
      });

      return distribution;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error(
        `Failed to fetch grade distribution: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Fetches a paginated, filtered, and searched list of a student's grades.
   * This method only queries local tables.
   * @param studentId The ID of the student.
   * @param options The query options for filtering, searching, and pagination.
   * @returns An object containing the list of raw grade/submission data and the total count.
   */
  public static async findMyGrades(
    studentId: string,
    options: GetMyGradesQuery
  ) {
    const { courseId, grade, status, page, limit } = options;
    const offset = (page - 1) * limit;

    const conditions = [eq(studentGrades.studentId, studentId)];

    if (courseId) {
      conditions.push(eq(studentGrades.courseId, courseId));
    }
    if (status === 'Graded') {
      conditions.push(isNotNull(studentGrades.grade));
    }
    if (status === 'Pending') {
      conditions.push(isNull(studentGrades.grade));
    }
    if (grade) {
      const [min, max] = grade.split('-').map(Number);
      conditions.push(gte(studentGrades.grade, min));
      if (max) {
        conditions.push(lte(studentGrades.grade, max));
      }
    }

    const whereClause = and(...conditions);

    const totalQuery = db
      .select({ value: count() })
      .from(studentGrades)
      .where(whereClause);

    const resultsQuery = db
      .select()
      .from(studentGrades)
      .where(whereClause)
      .orderBy(desc(studentGrades.gradedAt))
      .limit(limit)
      .offset(offset);

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultsQuery,
    ]);

    return { totalResults, results };
  }

  /**
   * Finds a single submission by its ID.
   * @param submissionId The ID of the submission.
   * @returns The submission object or undefined if not found.
   */
  public static async findSubmissionById(
    submissionId: string
  ): Promise<StudentGrade | undefined> {
    return db.query.studentGrades.findFirst({
      where: eq(studentGrades.submissionId, submissionId),
    });
  }

  /**
   * Calculates the average grade for all students across a list of courses.
   * @param courseIds An array of course IDs.
   * @returns A Map where the key is courseId and the value is the average grade.
   */
  public static async getCourseAverages(
    courseIds: string[]
  ): Promise<Map<string, number>> {
    if (courseIds.length === 0) {
      return new Map();
    }

    const result = await db
      .select({
        courseId: studentGrades.courseId,
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(inArray(studentGrades.courseId, courseIds))
      .groupBy(studentGrades.courseId);

    return new Map(
      result.map((row) => [row.courseId, parseFloat(row.averageGrade || '0')])
    );
  }

  /**
   * Calculates a student's grade rank within a specific course.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @returns The student's rank and the total number of students with grades in that course.
   */
  public static async getStudentRankInCourse(
    courseId: string,
    studentId: string
  ): Promise<{ rank: number | null; totalStudents: number }> {
    const rankingSubquery = db
      .select({
        studentId: studentGrades.studentId,
        rank: sql<number>`RANK() OVER (ORDER BY AVG(${studentGrades.grade}) DESC)`.as(
          'rank'
        ),
      })
      .from(studentGrades)
      .where(eq(studentGrades.courseId, courseId))
      .groupBy(studentGrades.studentId)
      .as('ranking');

    const [studentRank] = await db
      .select({ rank: rankingSubquery.rank })
      .from(rankingSubquery)
      .where(eq(rankingSubquery.studentId, studentId));

    const [total] = await db
      .select({ count: countDistinct(studentGrades.studentId) })
      .from(studentGrades)
      .where(eq(studentGrades.courseId, courseId));

    return {
      rank: studentRank ? Number(studentRank.rank) : null,
      totalStudents: total.count || 0,
    };
  }

  /**
   * Retrieves the top N students for a course based on average grade.
   * @param courseId The ID of the course.
   * @param limit The number of top students to return.
   * @returns A list of top students with their rank, ID, and average score.
   */
  public static async getTopStudentsInCourse(
    courseId: string,
    limit: number
  ): Promise<{ rank: number; studentId: string; score: number }[]> {
    const result = await db.execute(sql`
      WITH StudentAverages AS (
        SELECT
          student_id,
          AVG(grade) as avg_grade
        FROM ${studentGrades}
        WHERE ${studentGrades.courseId} = ${courseId}
        GROUP BY student_id
      ),
      RankedStudents AS (
        SELECT
          student_id,
          avg_grade,
          RANK() OVER (ORDER BY avg_grade DESC) as rank
        FROM StudentAverages
      )
      SELECT rank::int, student_id, avg_grade::numeric(5, 2) as score
      FROM RankedStudents
      WHERE rank <= ${limit}
      ORDER BY rank;
    `);

    return (
      result.rows as { rank: number; student_id: string; score: string }[]
    ).map((row) => ({
      rank: row.rank,
      studentId: row.student_id,
      score: parseFloat(row.score),
    }));
  }

  /**
   * Retrieves the average grade for each course for a given student.
   * @param studentId The ID of the student.
   * @param courseIds The list of course IDs to include.
   * @returns An array of objects containing the course ID and its average grade.
   */
  public static async getAverageGradesByCourses(
    studentId: string,
    courseIds: string[]
  ): Promise<
    {
      courseId: string;
      avgGrade: string | null;
    }[]
  > {
    const results = await db
      .select({
        courseId: studentGrades.courseId,
        avgGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.studentId, studentId),
          inArray(studentGrades.courseId, courseIds)
        )
      )
      .groupBy(studentGrades.courseId);

    return results;
  }

  /**
   * Fetches the average grade for a student for each of the last 6 months.
   * @param studentId The ID of the student.
   * @returns An array of objects with month and average grade.
   */
  public static async getRecentGrades(
    studentId: string
  ): Promise<{ month: string; averageGrade: number }[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(date_trunc('month', ${studentGrades.gradedAt}), 'Mon')`,
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.studentId, studentId),
          gte(studentGrades.gradedAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`date_trunc('month', ${studentGrades.gradedAt})`)
      .orderBy(sql`date_trunc('month', ${studentGrades.gradedAt})`);

    return result.map((row) => ({
      month: row.month,
      averageGrade: parseFloat(row.averageGrade || '0'),
    }));
  }

  /**
   * Fetches the most recent AI-generated learning path for a user.
   * @param userId The ID of the user.
   * @returns The latest learning path record, or undefined if none exists.
   */
  public static async getLatestLearningPath(
    userId: string
  ): Promise<AILearningPath | undefined> {
    return db.query.aiLearningPaths.findFirst({
      where: eq(aiLearningPaths.userId, userId),
      orderBy: [desc(aiLearningPaths.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated learning path for a user.
   * @param userId The ID of the user.
   * @param pathData The array of path data objects to save.
   */
  public static async upsertLearningPath(
    userId: string,
    pathData: PredictiveChartData
  ): Promise<void> {
    await db
      .insert(aiLearningPaths)
      .values({ userId, pathData, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiLearningPaths.userId,
        set: { pathData, generatedAt: new Date() },
      });
  }

  /**
   * Fetches the most recent AI-generated performance predictions for a user.
   * @param userId The Id of the user.
   * @returns The latest prediction record, or undefined if none exists.
   */
  public static getLatestPredictions(
    userId: string
  ): Promise<AIPerformancePrediction | undefined> {
    return db.query.aiPerformancePredictions.findFirst({
      where: eq(aiPerformancePredictions.userId, userId),
      orderBy: [desc(aiPerformancePredictions.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated performance predictions for a user.
   * @param userId The Id of the user.
   * @param predictions The array of prediction objects to save.
   */
  public static async upsertPredictions(
    userId: string,
    predictions: PerformancePrediction[]
  ): Promise<void> {
    await db
      .insert(aiPerformancePredictions)
      .values({
        userId,
        predictions,
        generatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: aiPerformancePredictions.userId,
        set: { predictions, generatedAt: new Date() },
      });
  }

  /**
   * Calculates the overall grade distribution for a student across all courses.
   * @param studentId The ID of the student.
   * @returns An array of objects with grade brackets and counts.
   */
  public static async getOverallGradeDistribution(
    studentId: string
  ): Promise<{ grade: string; count: number }[]> {
    const query = sql`
      SELECT
        CASE
          WHEN grade >= 90 THEN 'A'
          WHEN grade >= 80 THEN 'B'
          WHEN grade >= 70 THEN 'C'
          WHEN grade >= 60 THEN 'D'
          ELSE 'F'
        END AS grade_bracket,
        COUNT(*) AS student_count
      FROM ${studentGrades}
      WHERE ${studentGrades.studentId} = ${studentId}
      GROUP BY grade_bracket
      ORDER BY MIN(grade) DESC;
    `;
    const result = await db.execute<GradeRow>(query);
    return result.rows.map((row) => ({
      grade: row.grade_bracket,
      count: parseInt(row.student_count, 10),
    }));
  }

  /**
   * Analyzes a student's lesson sessions to find their peak study times.
   * @param studentId The ID of the student.
   * @returns An object containing the most active days and hours.
   */
  public static async getStudyTimeAnalytics(
    studentId: string
  ): Promise<{ peakDays: string[]; peakHours: string[] }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const daysQuery = db
      .select({
        day: sql<string>`TO_CHAR(${lessonSessions.startedAt}, 'Day')`,
        count: count(lessonSessions.sessionId),
      })
      .from(lessonSessions)
      .where(
        and(
          eq(lessonSessions.userId, studentId),
          gte(lessonSessions.startedAt, sevenDaysAgo)
        )
      )
      .groupBy(sql`TO_CHAR(${lessonSessions.startedAt}, 'Day')`)
      .orderBy(desc(count(lessonSessions.sessionId)))
      .limit(3);

    const hoursQuery = db
      .select({
        hour: sql<number>`EXTRACT(hour FROM ${lessonSessions.startedAt})`,
        count: count(lessonSessions.sessionId),
      })
      .from(lessonSessions)
      .where(
        and(
          eq(lessonSessions.userId, studentId),
          gte(lessonSessions.startedAt, sevenDaysAgo)
        )
      )
      .groupBy(sql`EXTRACT(hour FROM ${lessonSessions.startedAt})`)
      .orderBy(desc(count(lessonSessions.sessionId)))
      .limit(3);

    const [dayResults, hourResults] = await Promise.all([
      daysQuery,
      hoursQuery,
    ]);

    const formatHour = (hour: number) => {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h = hour % 12 || 12;
      return `${h} ${ampm}`;
    };

    return {
      peakDays: dayResults.map((r) => r.day.trim()),
      peakHours: hourResults.map((r) => formatHour(Number(r.hour))),
    };
  }

  /**
   * Fetches the most recent AI-generated learning recommendations for a user.
   * @param userId The ID of the user.
   * @returns The latest recommendation record, or undefined if none exists.
   */
  public static async getLearningLatestRecommendations(
    userId: string
  ): Promise<AILearningRecommendation | undefined> {
    return db.query.aiLearningRecommendations.findFirst({
      where: eq(aiLearningRecommendations.userId, userId),
      orderBy: [desc(aiLearningRecommendations.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated learning recommendations for a user.
   * @param userId The ID of the user.
   * @param recommendations The array of recommendation objects to save.
   */
  public static async upsertLearningRecommendations(
    userId: string,
    recommendations: LearningRecommendation[]
  ): Promise<void> {
    await db
      .insert(aiLearningRecommendations)
      .values({ userId, recommendations, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiLearningRecommendations.userId,
        set: { recommendations, generatedAt: new Date() },
      });
  }

  /**
   * Fetches a student's total study duration in hours, grouped by week, for the last 8 weeks.
   * @param studentId The ID of the student.
   * @returns An array of objects, each containing the week number and total study hours.
   */
  public static async getWeeklyStudyTrend(
    studentId: string
  ): Promise<{ week: string; studyHours: number }[]> {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const result = await db.execute(sql`
      SELECT
        'Week ' || TO_CHAR(${lessonSessions.startedAt}, 'W') AS week,
        SUM(${lessonSessions.durationMinutes}) / 60.0 AS study_hours
      FROM ${lessonSessions}
      WHERE ${lessonSessions.userId} = ${studentId}
        AND ${lessonSessions.startedAt} >= ${eightWeeksAgo}
      GROUP BY TO_CHAR(${lessonSessions.startedAt}, 'W'), DATE_TRUNC('week', ${lessonSessions.startedAt})
      ORDER BY DATE_TRUNC('week', ${lessonSessions.startedAt}) ASC;
    `);

    return (result.rows as { week: string; study_hours: string }[]).map(
      (row) => ({
        week: row.week.trim(),
        studyHours: parseFloat(row.study_hours),
      })
    );
  }

  /**
   * Aggregates module completion statuses across all of a student's enrollments.
   * @param studentId The ID of the student.
   * @returns An object with counts for completed, in-progress, and not-started modules.
   */
  public static async getOverallModuleCompletion(studentId: string): Promise<{
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  }> {
    const query = sql`
      WITH ModuleProgress AS (
        SELECT
          (module ->> 'id')::uuid as module_id,
          jsonb_array_length(module -> 'lessonIds') as total_lessons,
          (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(e.progress -> 'completedLessons') AS completed_lesson
            WHERE completed_lesson.value IN (SELECT jsonb_array_elements_text(module -> 'lessonIds'))
          ) as completed_lessons
        FROM enrollments e,
             jsonb_array_elements(e.course_structure -> 'modules') as module
        WHERE e.user_id = ${studentId}
      )

      SELECT
        SUM(CASE WHEN completed_lessons = total_lessons AND total_lessons > 0 THEN 1 ELSE 0 END)::int AS completed,
        SUM(CASE WHEN completed_lessons > 0 AND completed_lessons < total_lessons THEN 1 ELSE 0 END)::int AS "inProgress",
        SUM(CASE WHEN completed_lessons = 0 THEN 1 ELSE 0 END)::int AS "notStarted",
        COUNT(*)::int AS total
      FROM ModuleProgress;
    `;

    const result = await db.execute(query);

    if (result.rows.length === 0)
      return { completed: 0, inProgress: 0, notStarted: 0, total: 0 };

    const row = result.rows[0] as {
      completed: string;
      inProgress: string;
      notStarted: string;
      total: string;
    };

    return {
      completed: parseInt(row.completed, 10),
      inProgress: parseInt(row.inProgress, 10),
      notStarted: parseInt(row.notStarted, 10),
      total: parseInt(row.total, 10),
    };
  }

  /**
   * Fetches the most recent AI-generated progress insights for a user.
   * @param userId The ID of the user.
   * @returns The latest insight record, or undefined if none exists.
   */
  public static async getLatestProgressInsights(
    userId: string
  ): Promise<AIProgressInsightEntry | undefined> {
    return db.query.aiProgressInsights.findFirst({
      where: eq(aiProgressInsights.userId, userId),
      orderBy: [desc(aiProgressInsights.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated progress insights for a user.
   * @param userId The ID of the user.
   * @param insights The array of insight objects to save.
   */
  public static async upsertProgressInsights(
    userId: string,
    insights: AIProgressInsight[]
  ): Promise<void> {
    await db
      .insert(aiProgressInsights)
      .values({ userId, insights, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiProgressInsights.userId,
        set: { insights, generatedAt: new Date() },
      });
  }

  /**
   * Fetches all enrollments to determine course-related milestones.
   * @param studentId The ID of the student.
   * @returns An array of enrollment objects with course titles.
   */
  public static async findCourseProgressMilestones(studentId: string) {
    return db
      .select({
        courseId: enrollments.courseId,
        status: enrollments.status,
        date: sql<string>`CASE WHEN ${enrollments.status} = 'completed' THEN ${enrollments.updatedAt} ELSE ${enrollments.enrolledAt} END`,
        courseTitle: courses.title,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, studentId));
  }

  /**
   * Fetches a student's total study duration in minutes for each of the last 7 days.
   * @param studentId The ID of the student.
   * @returns An array of objects, each containing the day of the week and total minutes studied.
   */
  public static async getDailyStudyHabits(
    studentId: string
  ): Promise<{ day: string; totalMinutes: number }[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        day: sql<string>`TO_CHAR(${lessonSessions.startedAt}, 'Day')`,
        totalMinutes: sum(lessonSessions.durationMinutes),
      })
      .from(lessonSessions)
      .where(
        and(
          eq(lessonSessions.userId, studentId),
          gte(lessonSessions.startedAt, sevenDaysAgo)
        )
      )
      .groupBy(
        sql`TO_CHAR(${lessonSessions.startedAt}, 'Day'), DATE_TRUNC('day', ${lessonSessions.startedAt})`
      )
      .orderBy(sql`DATE_TRUNC('day', ${lessonSessions.startedAt})`);

    return result.map((row) => ({
      day: row.day.trim(),
      totalMinutes: parseFloat(row.totalMinutes || '0'),
    }));
  }

  /**
   * Calculates the average grade for a student, grouped by the course's instructor ID (as a proxy for category).
   * @param studentId The ID of the student.
   * @returns An array of objects, each with a category (instructorId) and the average grade.
   */
  public static async getAverageGradesByCourseCategory(
    studentId: string
  ): Promise<{ category: string; averageGrade: number }[]> {
    const result = await db
      .select({
        category: courses.instructorId,
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .innerJoin(courses, eq(studentGrades.courseId, courses.id))
      .where(eq(studentGrades.studentId, studentId))
      .groupBy(courses.instructorId);

    return result.map((row) => ({
      category: row.category,
      averageGrade: parseFloat(row.averageGrade || '0'),
    }));
  }

  /**
   * Fetches the most recent AI-generated learning efficiency data for a user.
   * @param userId The ID of the user.
   * @returns The latest efficiency record, or undefined if none exists.
   */
  public static async getLatestLearningEfficiency(
    userId: string
  ): Promise<AILearningEfficiency | undefined> {
    return db.query.aiLearningEfficiency.findFirst({
      where: eq(aiLearningEfficiency.userId, userId),
      orderBy: [desc(aiLearningEfficiency.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated learning efficiency data for a user.
   * @param userId The ID of the user.
   * @param efficiencyData The array of efficiency data objects to save.
   */
  public static async upsertLearningEfficiency(
    userId: string,
    efficiencyData: LearningEfficiency[]
  ): Promise<void> {
    await db
      .insert(aiLearningEfficiency)
      .values({ userId, efficiencyData, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiLearningEfficiency.userId,
        set: { efficiencyData, generatedAt: new Date() },
      });
  }

  /**
   * Aggregates the total study time in hours for a student, grouped by course.
   * @param studentId The ID of the student.
   * @returns An array of objects, each containing a courseId and the total hours studied.
   */
  public static async getTimeSpentPerCourse(
    studentId: string
  ): Promise<{ courseId: string; totalHours: number }[]> {
    const result = await db
      .select({
        courseId: lessonSessions.courseId,
        totalMinutes: sum(lessonSessions.durationMinutes),
      })
      .from(lessonSessions)
      .where(eq(lessonSessions.userId, studentId))
      .groupBy(lessonSessions.courseId);

    return result.map((row) => ({
      courseId: row.courseId,
      totalHours: parseFloat(row.totalMinutes || '0') / 60,
    }));
  }

  /**
   * Fetches the most recent AI-generated study habits for a user.
   * @param userId The ID of the user.
   * @returns The latest habits record, or undefined if none exists.
   */
  public static async getLatestStudyHabits(
    userId: string
  ): Promise<AIStudyHabitEntry | undefined> {
    return db.query.aiStudyHabits.findFirst({
      where: eq(aiStudyHabits.userId, userId),
      orderBy: [desc(aiStudyHabits.generatedAt)],
    });
  }

  /**
   * Saves or updates the AI-generated study habits for a user.
   * @param userId The ID of the user.
   * @param habitsData The array of habit data objects to save.
   */
  public static async upsertStudyHabits(
    userId: string,
    habitsData: StudyHabit[]
  ): Promise<void> {
    await db
      .insert(aiStudyHabits)
      .values({ userId, habitsData, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: aiStudyHabits.userId,
        set: { habitsData, generatedAt: new Date() },
      });
  }

  /**
   * Calculates the average grade for a student, grouped by courseId.
   * @param studentId The ID of the student.
   * @returns An array of objects, each with a courseId and the average grade.
   */
  public static async getAverageGradesByCourse(
    studentId: string
  ): Promise<{ courseId: string; averageGrade: number }[]> {
    const result = await db
      .select({
        courseId: studentGrades.courseId,
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(eq(studentGrades.studentId, studentId))
      .groupBy(studentGrades.courseId);

    return result.map((row) => ({
      courseId: row.courseId,
      averageGrade: parseFloat(row.averageGrade || '0'),
    }));
  }
}
