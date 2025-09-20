'use server';

import { getLeaderboardStats } from '../api/analytics.api';

export const getLeaderboardStatsAction = async () => {
  try {
    return { data: await getLeaderboardStats() };
  } catch (error) {
    console.error('Failed to fetch leaderboard stats:', error);

    return { error: 'Could not retrieve leaderboard data.' };
  }
};
