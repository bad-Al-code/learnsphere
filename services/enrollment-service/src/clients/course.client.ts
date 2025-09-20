import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';

interface CourseInfo {
  id: string;
  title: string;
}
export class CourseClient {
  private static courseServiceUrl = env.COURSE_SERVICE_URL;
  /**
   * Fetches basic details for multiple courses.
   * @param courseIds An array of course IDs.
   * @returns A Map of courseId to course details.
   */
  public static async getCoursesByIds(
    courseIds: string[]
  ): Promise<Map<string, CourseInfo>> {
    const courseMap = new Map<string, CourseInfo>();
    if (courseIds.length === 0) return courseMap;

    try {
      const response = await axios.post<{ id: string; title: string }[]>(
        `${this.courseServiceUrl}/api/courses/bulk`,
        { courseIds }
      );

      response.data.forEach((course) => courseMap.set(course.id, course));
    } catch (error) {
      logger.error('Failed to bulk fetch course details', { error });
    }

    return courseMap;
  }

  /**
   * Fetches the count of pending assignments for a user by forwarding their cookie.
   * @param cookie The user's authentication cookie header.
   * @returns The count of pending assignments.
   */
  public static async getPendingAssignmentsCount(
    cookie: string
  ): Promise<number> {
    try {
      const response = await axios.get<{ count: number }>(
        `${this.courseServiceUrl}/api/assignments/my-pending-count`,
        { headers: { Cookie: cookie } }
      );

      return response.data.count;
    } catch (error) {
      logger.error('Failed to fetch pending assignments count', { error });
      return 0;
    }
  }

  /**
   * Get the user's pending assignments.
   * @param {string} cookie - User authentication cookie.
   * @returns {Promise<{ title: string; course: string; dueDate: string | null }[]>} Array of pending assignments.
   */
  public static async getPendingAssignments(
    cookie: string
  ): Promise<{ title: string; course: string; dueDate: string | null }[]> {
    try {
      const response = await axios.get<
        { title: string; course: string; dueDate: string | null }[]
      >(`${this.courseServiceUrl}/api/assignments/my-pending`, {
        headers: { Cookie: cookie },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch pending assignments from course-service', {
        error,
      });
      return [];
    }
  }
}
