import { AnalyticsRepository } from '../db/analytics.repository';

/**
 * @class AnalyticsService
 * @description Provides business logic for analytics-related operations.
 * This service acts as an intermediary between the controller and the repository,
 * orchestrating data retrieval and any additional business rule processing.
 */
export class AnalyticsService {
  public static async getInstructorAnalytics(instructorId: string) {
    const stats = await AnalyticsRepository.getInstructorStats(instructorId);
    return stats;
  }
}
