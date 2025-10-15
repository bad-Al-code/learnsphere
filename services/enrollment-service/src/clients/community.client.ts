import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
}

export class CommunityClient {
  private static communityServiceUrl = env.COMMUNITY_SERVICE_URL;

  /**
   * Fetches upcoming events for a user by forwarding their auth cookie.
   * @param cookie The raw cookie header from the incoming request.
   * @returns An array of upcoming event objects.
   */
  public static async getMyUpcomingEvents(
    cookie: string
  ): Promise<UpcomingEvent[]> {
    if (!this.communityServiceUrl) {
      logger.error('COMMUNITY_SERVICE_URL is not defined.');
      return [];
    }

    try {
      const response = await axios.get<UpcomingEvent[]>(
        `${this.communityServiceUrl}/api/community/events/my-upcoming`,
        {
          headers: {
            Cookie: cookie,
            'x-internal-api-key': env.INTERNAL_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(
        'Failed to fetch upcoming events from community-service: %o',
        {
          error,
        }
      );

      return [];
    }
  }
}
