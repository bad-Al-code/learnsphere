'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeaderboardStatsAction } from '../actions/analytics.action';

export const useLeaderboardData = () => {
  return useQuery({
    queryKey: ['leaderboard-stats'],

    queryFn: async () => {
      const result = await getLeaderboardStatsAction();
      if (result.error) throw new Error(result.error);

      console.log(result.data);
      return result.data;
    },
  });
};
