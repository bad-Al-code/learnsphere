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
}
