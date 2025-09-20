'use server';

import { getLeaderboardStats } from '../api/analytics.api';
import { getMyAIInsights, getMyStudyTrend } from '../api/enrollment.api';

export const getLeaderboardStatsAction = async () => {
  try {
    return { data: await getLeaderboardStats() };
  } catch (error) {
    console.error('Failed to fetch leaderboard stats:', error);

    return { error: 'Could not retrieve leaderboard data.' };
  }
};

export const getMyStudyTrendAction = async () => {
  try {
    return { data: await getMyStudyTrend() };
  } catch (error) {
    return { error: 'Could not retrieve study trend.' };
  }
};

export const getMyAIInsightsAction = async () => {
  try {
    return { data: await getMyAIInsights() };
  } catch (error) {
    return { error: 'Could not retrieve AI insights.' };
  }
};
