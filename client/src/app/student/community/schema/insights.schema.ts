import { z } from 'zod';

export const communityInsightsSchema = z.object({
  questionsAnswered: z.string(),
  activeDiscussions: z.number(),
  communityMembers: z.number(),
});

export type CommunityInsights = z.infer<typeof communityInsightsSchema>;
