import {
  and,
  avg,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  lt,
  sql,
  sum,
} from 'drizzle-orm';
import { db } from '..';
import { GradeRow } from '../../types';
import {
  courseActivityLogs,
  courses,
  dailyActivity,
  enrollments,
  lessonSessions,
  NewActivityLog,
  NewLessonSession,
  NewReportJob,
  reportJobs,
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
   * Calculates the overall average grade for a single student across all their courses.
   * @param studentId The ID of the student
   * @returns The average grade as a number (0-100), or null if no grades are found.
   */
  public static async getOverallAverageGradeForStudent(
    studentId: string
  ): Promise<number | null> {
    const [result] = await db
      .select({
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(eq(studentGrades.studentId, studentId));

    return result && result.averageGrade
      ? parseFloat(result.averageGrade)
      : null;
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
    DateSeries AS (
      SELECT
        activity_date,
        activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date DESC))::int AS date_group
      FROM UserActivityDates
    ),
    StreakCalculation AS (
      SELECT date_group, COUNT(*) AS streak_length
      FROM DateSeries
      WHERE activity_date >= CURRENT_DATE - INTERVAL '1 day'
      GROUP BY date_group
    )
    SELECT COALESCE(MAX(streak_length), 0) AS streak
    FROM StreakCalculation;
  `);

    return (result.rows[0]?.streak as number) || 0;
  }
}
