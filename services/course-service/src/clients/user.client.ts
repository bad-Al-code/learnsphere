import axios from "axios";
import logger from "../config/logger";
import { env } from "../config/env";

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
    userIds: string[],
  ): Promise<Map<string, PublicProfile>> {
    if (!this.userServiceUrl || userIds.length === 0) {
      return new Map();
    }

    try {
      logger.info(`Fetching ${userIds.length} profiles from user-service.`);

      const response = await axios.post<PublicProfile[]>(
        `${this.userServiceUrl}/api/users/bulk`,
        { userIds },
      );

      const profilesMap = new Map<string, PublicProfile>();
      for (const profile of response.data) {
        profilesMap.set(profile.userId, profile);
      }

      return profilesMap;
    } catch (error) {
      logger.error("Failed to fetch profiles in bulk from user-service", {
        error:
          error instanceof axios.AxiosError ? error.message : String(error),
      });

      return new Map();
    }
  }
}
