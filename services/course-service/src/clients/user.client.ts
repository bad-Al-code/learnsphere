import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';

interface PublicProfile {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
}

export class UserClient {
  private static userServiceUrl = env.USER_SERVICE_URL!;

  /**
   * Fetches multiple public profiles from the user-service in a single bulk request.
   * @param userIds An array of user IDs to fetch,
   * @returns A map of userId to public profile.
   */
  public static async getPublicProfiles(
    userIds: string[]
  ): Promise<Map<string, PublicProfile>> {
    if (!this.userServiceUrl || userIds.length === 0) {
      return new Map();
    }

    try {
      logger.info(`Fetching ${userIds.length} profiles from user-service.`);

      const response = await axios.post<PublicProfile[]>(
        `${this.userServiceUrl}/api/users/bulk`,
        { userIds }
      );

      const profilesMap = new Map<string, PublicProfile>();
      for (const profile of response.data) {
        profilesMap.set(profile.userId, profile);
      }

      return profilesMap;
    } catch (error) {
      logger.error('Failed to fetch profiles in bulk from user-service', {
        error:
          error instanceof axios.AxiosError ? error.message : String(error),
      });

      return new Map();
    }
  }

  /**
   * Finds a user by their email address.
   * @param email - The email of the user to look up.
   * @returns A promise that resolves to an object containing the user's ID if found, or null if no user exists with that email.
   */
  public static async findUserByEmail(
    email: string
  ): Promise<{ id: string } | null> {
    try {
      const response = await axios.get<{ id: string }>(
        `${this.userServiceUrl}/api/users/by-email/${email}`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      logger.error('Failed to fetch user by email', { error });

      throw error;
    }
  }
}
