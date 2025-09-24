import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';

export class EnrollmentClient {
  private static enrollmentServiceUrl = env.ENROLLMENT_SERVICE_URL;

  /**
   * Fetches enrolled course IDs for a user by forwarding their auth token.
   * @param cookie - The raw cookie header from the incoming request.
   * @returns An array of course ID strings.
   */
  public static async getEnrolledCourseIds(cookie: string): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(
        `${this.enrollmentServiceUrl}/api/enrollments/my-course-ids`,
        { headers: { Cookie: cookie } }
      );

      return response.data;
    } catch (error) {
      logger.error(
        'Failed to fetch enrolled course IDs from enrollment-service',
        { error }
      );
      return [];
    }
  }

  /**
   * Checks if a user is enrolled in a course via a direct server-to-server call.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A boolean indicating enrollment status.
   */
  public static async isEnrolled(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.enrollmentServiceUrl}/api/enrollments/status/${courseId}/${userId}`
      );

      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }

      logger.error('Failed to check enrollment status', { error });
      return false;
    }
  }
}
