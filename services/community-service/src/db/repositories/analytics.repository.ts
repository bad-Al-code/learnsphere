import { and, count, eq } from 'drizzle-orm';
import { db } from '..';
import { conversations, users } from '../schema';

export class AnalyticsRepository {
  /**
   * Fetches key community insights including:
   * - Total group discussions
   * - Number of answered/resolved group discussions
   * - Total registered members
   * @returns An object containing totalDiscussions, answeredDiscussions, and totalMembers
   */
  public static async getCommunityInsights(): Promise<{
    totalDiscussions: number;
    answeredDiscussions: number;
    totalMembers: number;
  }> {
    const [totalDiscussions] = await db
      .select({ value: count() })
      .from(conversations)
      .where(eq(conversations.type, 'group'));
    const [answeredDiscussions] = await db
      .select({ value: count() })
      .from(conversations)
      .where(
        and(eq(conversations.type, 'group'), eq(conversations.isResolved, true))
      );
    const [totalMembers] = await db.select({ value: count() }).from(users);

    return {
      totalDiscussions: totalDiscussions.value,
      answeredDiscussions: answeredDiscussions.value,
      totalMembers: totalMembers.value,
    };
  }
}
