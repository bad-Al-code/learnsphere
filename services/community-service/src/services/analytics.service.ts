import { AnalyticsRepository } from '../db/repositories';

export class AnalyticsService {
  /**
   * Computes a summarized view of community activity including:
   * - Percentage of answered discussions
   * - Total active group discussions
   * - Total community members
   * @returns An object containing:
   *   - questionsAnswered: Percentage of answered discussions as a string (e.g., "75%")
   *   - activeDiscussions: Number of total group discussions
   *   - communityMembers: Total registered community members
   */
  public static async getCommunityInsights(): Promise<{
    questionsAnswered: string;
    activeDiscussions: number;
    communityMembers: number;
  }> {
    const { totalDiscussions, answeredDiscussions, totalMembers } =
      await AnalyticsRepository.getCommunityInsights();

    const answeredPercentage =
      totalDiscussions > 0
        ? Math.round((answeredDiscussions / totalDiscussions) * 100)
        : 0;

    return {
      questionsAnswered: `${answeredPercentage}%`,
      activeDiscussions: totalDiscussions,
      communityMembers: totalMembers,
    };
  }
}
