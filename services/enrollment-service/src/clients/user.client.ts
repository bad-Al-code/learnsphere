import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';
import { PublicUserData } from '../types';

export class UserClient {
  private static userServiceUrl = env.USER_SERVICE_URL;

  /**
   * Fetches public profile data for a list of user IDs.
   * @param {string[]} userIds - The list of user IDs to fetch.
   * @returns {Promise<Map<string, PublicUserData>>}
   */
  public static async getPublicProfiles(
    userIds: string[]
  ): Promise<Map<string, PublicUserData>> {
    const userMap = new Map<string, PublicUserData>();
    if (userIds.length === 0) return userMap;

    try {
      const response = await axios.post<PublicUserData[]>(
        `${this.userServiceUrl}/api/users/bulk`,
        { userIds }
      );

      for (const profile of response.data) {
        userMap.set(profile.userId, profile);
      }
    } catch (error) {
      logger.error('Failed to bulk fetch user profiles', { error });
    }

    return userMap;
  }

  /**
   * Fetches the weekly study hours target for a user from the user-service.
   * @param userId The ID of the user.
   * @returns The target number of hours, or 0 if not set or on error.
   */
  public static async getWeeklyStudyGoal(userId: string): Promise<number> {
    try {
      const response = await axios.get<{ targetValue: number }>(
        `${this.userServiceUrl}/api/users/internal/study-goal`,
        {
          params: {
            userId,
            type: 'weekly_study_hours',
          },
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
          },
        }
      );

      return response.data.targetValue || 0;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.debug(`No weekly study goal found for user ${userId}.`);

        return 0;
      }

      logger.error(
        `Failed to fetch weekly study goal for user ${userId} from user-service: %o`,
        { error }
      );

      return 0;
    }
  }
}
