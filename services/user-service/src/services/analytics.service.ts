import logger from '../config/logger';
import { AnalyticsRepository, WaitlistRepository } from '../db/repositories';
import { ForbiddenError } from '../errors';
import { WaitlistAnalytics } from '../schemas/analytics.schema';
import { Requester } from '../types';

export class AnalyticsService {
  /**
   * Retrieves a comprehensive set of analytics for the waitlist.
   * Access is restricted to admin users.
   * @param requester The user making the request.
   * @returns A promise resolving to the waitlist analytics data.
   */
  public static async getWaitlistAnalytics(
    requester: Requester
  ): Promise<WaitlistAnalytics> {
    if (requester.role !== 'admin') {
      logger.warn(
        `Non-admin user ${requester.id} attempted to access waitlist analytics.`
      );

      throw new ForbiddenError(
        'You do not have permission to access these analytics.'
      );
    }

    logger.info('Fetching waitlist analytics for admin dashboard.');

    try {
      const [
        totalSignups,
        dailySignups,
        topReferrers,
        interestDistribution,
        roleDistribution,
      ] = await Promise.all([
        WaitlistRepository.count(),
        AnalyticsRepository.getDailySignups(7),
        AnalyticsRepository.getTopReferrers(5),
        AnalyticsRepository.getInterestDistribution(),
        AnalyticsRepository.getRoleDistribution(),
      ]);

      return {
        totalSignups,
        dailySignups,
        topReferrers,
        interestDistribution,
        roleDistribution,
      };
    } catch (error) {
      logger.error('Failed to retrieve waitlist analytics: %o', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Could not retrieve waitlist analytics.');
    }
  }
}
