import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';
import { User } from '../db/schema';

export class UserClient {
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
        `${env.USER_SERVICE_URL}/api/users/${userId}`
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
}
