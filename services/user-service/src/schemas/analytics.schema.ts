import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     WaitlistAnalyticsResponse:
 *       type: object
 *       properties:
 *         totalSignups:
 *           type: integer
 *           description: Total number of users on the waitlist.
 *         dailySignups:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               count:
 *                 type: integer
 *         topReferrers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               referrals:
 *                 type: integer
 *         interestDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               interest:
 *                 type: string
 *               count:
 *                 type: integer
 *         roleDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               count:
 *                 type: integer
 */
export const waitlistAnalyticsSchema = z.object({
  totalSignups: z.number(),
  dailySignups: z.array(z.object({ date: z.string(), count: z.number() })),
  topReferrers: z.array(z.object({ email: z.string(), referrals: z.number() })),
  interestDistribution: z.array(
    z.object({ interest: z.string(), count: z.number() })
  ),
  roleDistribution: z.array(z.object({ role: z.string(), count: z.number() })),
});

export type WaitlistAnalytics = z.infer<typeof waitlistAnalyticsSchema>;
