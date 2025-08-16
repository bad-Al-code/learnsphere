import { faker } from '@faker-js/faker';
import { count, eq, inArray } from 'drizzle-orm';

import { db } from '..';
import {
  assignments,
  assignmentSubmissions,
  courses,
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

    // We need total students to calculate utilization
    // This requires a call to enrollment service or a local replica
    // For now, simulate this part, acknowledging the need for inter-service communication
    const totalStudents = faker.number.int({ min: 50, max: 500 }); // NOTE: Placeholder

    return { timelinessData, totalResources, totalDownloads, totalStudents };
  }
}
