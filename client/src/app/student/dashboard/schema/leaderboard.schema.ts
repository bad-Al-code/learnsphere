import { z } from 'zod';

const leaderboardUserSchema = z.object({
  rank: z.number(),
  name: z.string(),
  initials: z.string(),
  streak: z.number(),
  points: z.number(),
});

const statSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const achievementSchema = z.object({
  title: z.string(),
  icon: z.enum(['Flame', 'Users', 'CheckCircle']),
});

const userStatsSchema = z.object({
  rank: z.number(),
  points: z.number(),
  stats: z.array(statSchema),
  achievements: z.array(achievementSchema),
});

export const leaderboardDataSchema = z.object({
  leaderboard: z.array(leaderboardUserSchema),
  userStats: userStatsSchema,
});
export type LeaderboardData = z.infer<typeof leaderboardDataSchema>;
