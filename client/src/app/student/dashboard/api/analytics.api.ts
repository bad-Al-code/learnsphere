import { enrollmentService } from '@/lib/api/server';
import { LeaderboardData } from '../schema/leaderboard.schema';

export const getLeaderboardStats = (): Promise<LeaderboardData> => {
  return enrollmentService.getTyped<LeaderboardData>(
    '/api/analytics/my-leaderboard-stats'
  );
};
