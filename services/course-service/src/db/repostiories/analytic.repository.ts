import { faker } from '@faker-js/faker';
import { avg, count, eq, inArray } from 'drizzle-orm';

import { db } from '..';
import {
  assignments,
  assignmentSubmissions,
  courses,
  lessons,
  modules,
  resourceDownloads,
  resources,
} from '../schema';

export class AnalyticsRepository {
  /**
   * @async
   * @description Fetches raw data needed for calculating learning analytics for an instructor.
   * @param {string} instructorId - The UUID of the instructor.
   * @returns {Promise<object>} An object containing data for timeliness and resource usage.
   */
  public static async getLearningAnalyticsRawData(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return {
        timelinessData: [],
        totalResources: 0,
        totalDownloads: 0,
        totalStudents: 0,
      };
    }
    const courseIds = instructorCourses.map((c) => c.id);

    const timelinessData = await db
      .select({
        submittedAt: assignmentSubmissions.submittedAt,
        dueDate: assignments.dueDate,
      })
      .from(assignmentSubmissions)
      .innerJoin(
        assignments,
        eq(assignmentSubmissions.assignmentId, assignments.id)
      )
      .where(inArray(assignmentSubmissions.courseId, courseIds));

    const [totalResourcesResult] = await db
      .select({ value: count() })
      .from(resources)
      .where(inArray(resources.courseId, courseIds));
    const totalResources = totalResourcesResult.value;

    const [totalDownloadsResult] = await db
      .select({ value: count() })
      .from(resourceDownloads)
      .where(inArray(resourceDownloads.courseId, courseIds));
    const totalDownloads = totalDownloadsResult.value;

    const totalStudents = faker.number.int({ min: 50, max: 500 }); // NOTE: Placeholder

    return { timelinessData, totalResources, totalDownloads, totalStudents };
  }

  /**
   * @async
   * @description Fetches raw data for content performance analysis for a specific instructor.
   * @param {string} instructorId - The UUID of the instructor.
   * @returns {Promise<object>} An object containing aggregated data for different content types.
   */
  public static async getContentPerformanceRawData(instructorId: string) {
    const instructorCourses = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.instructorId, instructorId));

    if (instructorCourses.length === 0) {
      return {
        assignments: { total: 0, averageGrade: 0 },
        textLessons: { total: 0 },
        videoLessons: { total: 0 },
      };
    }
    const courseIds = instructorCourses.map((c) => c.id);

    const [assignmentStats] = await db
      .select({
        total: count(assignmentSubmissions.id),
        averageGrade: avg(assignmentSubmissions.grade),
      })
      .from(assignmentSubmissions)
      .where(inArray(assignmentSubmissions.courseId, courseIds));

    const lessonCounts = await db
      .select({
        type: lessons.lessonType,
        count: count(),
      })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(inArray(modules.courseId, courseIds))
      .groupBy(lessons.lessonType);

    const textLessons = lessonCounts.find((l) => l.type === 'text') || {
      count: 0,
    };
    const videoLessons = lessonCounts.find((l) => l.type === 'video') || {
      count: 0,
    };

    return {
      assignments: {
        total: assignmentStats.total,
        averageGrade: parseFloat(assignmentStats.averageGrade || '0'),
      },
      textLessons: { total: textLessons.count },
      videoLessons: { total: videoLessons.count },
    };
  }
}
