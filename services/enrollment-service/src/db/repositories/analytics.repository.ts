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
import {
  courseActivityLogs,
  courses,
  dailyActivity,
  enrollments,
  NewActivityLog,
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
    const [result] = await db
      .select({
        totalStudents: countDistinct(enrollments.userId),
        avgCompletion: avg(enrollments.progressPercentage),
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    return {
      totalStudents: result.totalStudents || 0,
      avgCompletion: parseFloat(result.avgCompletion || '0'),
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
      orderBy: [desc(courseActivityLogs.createdAt)],
      limit: 5,
    });

    const [
      enrollmentsLast30Days,
      enrollmentsPrevious30Days,
      totalDiscussions,
      recentActivity,
    ] = await Promise.all([
      enrollmentsLast30DaysQuery,
      enrollmentsPrevious30DaysQuery,
      totalDiscussionsQuery,
      recentActivityQuery,
    ]);

    return {
      enrollmentsLast30Days: enrollmentsLast30Days[0].value,
      enrollmentsPrevious30Days: enrollmentsPrevious30Days[0].value,
      totalDiscussions: totalDiscussions[0].value,
      recentActivity,
      resourceDownloads: 0, // Placeholder until we track this event
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
        module_id,
        (AVG(CASE WHEN total_lessons > 0 THEN (completed_lessons::decimal / total_lessons) ELSE 0 END) * 100)::numeric(5, 2) AS completion_rate
      FROM
        ModuleCompletion
      GROUP BY
        module_id
      ORDER BY 
        completion_rate 
      DESC 
      LIMIT 5;
    `;

    const result = await db.execute(query);

    return result.rows as { module_id: string; completion_rate: string }[];
  }
}
