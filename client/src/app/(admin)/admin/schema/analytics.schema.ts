import { z } from 'zod';

export const dailySignupSchema = z.object({
  date: z.string(),
  count: z.number(),
});

export const topReferrerSchema = z.object({
  email: z.string(),
  referrals: z.number(),
});

export const distributionSchema = z.object({
  name: z.string(),
  value: z.number(),
  fill: z.string(),
});

export const waitlistAnalyticsResponseSchema = z.object({
  totalSignups: z.number(),
  dailySignups: z.array(dailySignupSchema),
  topReferrers: z.array(topReferrerSchema),
  interestDistribution: z.array(
    z.object({ interest: z.string(), count: z.number() })
  ),
  roleDistribution: z.array(z.object({ role: z.string(), count: z.number() })),
});

export type WaitlistAnalyticsData = z.infer<
  typeof waitlistAnalyticsResponseSchema
>;
