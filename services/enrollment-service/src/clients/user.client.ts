import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';
import { PublicUserData } from '../types';

export class UserClient {
  private static userServiceUrl = env.USER_SERVICE_URL;

  /**
   * Fetches multiple public user data objects in a single bulk request.
   * @param userIds An array of user IDs.
   * @returns A Map of userId to public user data.
   */
  public static async getUsersInBatch(userIds: string[]): Promise<Map<string, PublicUserData>> {
    if (userIds.length === 0) return new Map();

    try {
      logger.debug(`Batch fetching ${userIds.length} users from user-service`);

      const response = await axios.post<PublicUserData[]>(`${this.userServiceUrl}/api/users/bulk`, { userIds });

      const userMap = new Map<string, PublicUserData>();
      for (const user of response.data) {
        userMap.set(user.userId, user);
      }

      return userMap;
    } catch (error) {
      logger.error('Failed to batch fetch users from user-service', { error });
      return new Map();
    }
  }
}