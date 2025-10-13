import { count, desc, gte, sql } from 'drizzle-orm';

import { db } from '..';
import { waitlist } from '../schema';

export class AnalyticsRepository {
  /**
   * Retrieves the number of waitlist sign-ups for each of the last N days.
   * @param days The number of days to look back.
   * @returns An array of objects, each containing a date and the count of sign-ups for that date.
   */
  public static async getDailySignups(
    days: number = 7
  ): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const result = await db
      .select({
        date: sql<string>`DATE_TRUNC('day', ${waitlist.createdAt})::date`,
        count: count(waitlist.id),
      })
      .from(waitlist)
      .where(gte(waitlist.createdAt, startDate))
      .groupBy(sql`DATE_TRUNC('day', ${waitlist.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${waitlist.createdAt})`);

    return result.map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      count: Number(row.count),
    }));
  }

  /**
   * Retrieves the top N referrers from the waitlist.
   * @param limit The number of top referrers to retrieve.
   * @returns An array of top referrers with their email and referral count.
   */
  public static async getTopReferrers(
    limit: number = 5
  ): Promise<{ email: string; referrals: number }[]> {
    return db
      .select({
        email: waitlist.email,
        referrals: waitlist.referralCount,
      })
      .from(waitlist)
      .where(gte(waitlist.referralCount, 1))
      .orderBy(desc(waitlist.referralCount))
      .limit(limit);
  }

  /**
   * Calculates the distribution of user interests from the waitlist.
   * @returns An array of objects, each with an interest and its count.
   */
  public static async getInterestDistribution(): Promise<
    { interest: string; count: number }[]
  > {
    const result = await db.execute(sql`
      SELECT unnest(interests) AS interest, COUNT(*) AS count
      FROM ${waitlist}
      GROUP BY interest
      ORDER BY count DESC;
    `);

    return (result.rows as { interest: string; count: string }[]).map(
      (row) => ({
        interest: row.interest,
        count: parseInt(row.count, 10),
      })
    );
  }

  /**
   * Calculates the distribution of roles ('student' vs 'instructor') in the waitlist.
   * @returns An array of objects, each with a role and its count.
   */
  public static async getRoleDistribution(): Promise<
    { role: string; count: number }[]
  > {
    const result = await db
      .select({
        role: waitlist.role,
        count: count(waitlist.id),
      })
      .from(waitlist)
      .groupBy(waitlist.role);

    return result.map((row) => ({
      role: row.role,
      count: Number(row.count),
    }));
  }
}
