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
}
