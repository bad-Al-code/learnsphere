import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';
import { User } from '../db/schema';
import { PublicProfile } from '../types';

export class UserClient {
  private static userServiceUrl = env.USER_SERVICE_URL;

  /**
   * Fetches a single user's profile details from the user-service.
   * @param userId The ID of the user to fetch.
   * @returns The user data or null if not found.
   */
  public static async getUserById(
    userId: string
  ): Promise<Pick<User, 'id' | 'name' | 'avatarUrl'> | null> {
    try {
      const response = await axios.get(
        `${this.userServiceUrl}/api/users/${userId}`
      );

      const userData = response.data;

      return {
        id: userData.userId,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        avatarUrl: userData.avatarUrls?.small || null,
      };
    } catch (err) {
      const error = err as Error;

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.warn(`User with ID ${userId} not found in user-service.`);

        return null;
      }

      logger.error(`Failed to fetch user ${userId} from user-service`, {
        error,
      });

      throw new Error('Could not communicate with the user service.');
    }
  }

  public static async getPublicProfiles(
    userIds: string[]
  ): Promise<Map<string, PublicProfile>> {
    const userMap = new Map<string, PublicProfile>();
    if (userIds.length === 0) return userMap;

    try {
      const response = await axios.post<PublicProfile[]>(
        `${this.userServiceUrl}/api/users/bulk`,
        { userIds }
      );

      response.data.forEach((profile) => userMap.set(profile.userId, profile));
    } catch (error) {
      logger.error('Failed to bulk fetch user profiles from user-service', {
        error,
      });
    }

    return userMap;
  }
}
