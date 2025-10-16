'use server';

import { achievementApi } from '../api/achievement.api.client';
import {
  TAchievement,
  TAchievementListResponse,
  TBulkUpdateStarred,
  TCollectionListResponse,
  TExportRequest,
  TFilter,
  TShareAchievement,
  TSortOption,
  TStatistics,
  TUpdateStarred,
} from '../schemas/achievement.schema';

export async function getAchievementsAction(params: {
  filters?: TFilter;
  sort?: TSortOption;
  page?: number;
  limit?: number;
}): Promise<TAchievementListResponse> {
  try {
    return await achievementApi.getAchievements(params);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    throw new Error('Failed to fetch achievements');
  }
}

export async function getAchievementAction(id: string): Promise<TAchievement> {
  try {
    return await achievementApi.getAchievement(id);
  } catch (error) {
    console.error('Failed to fetch achievement:', error);
    throw new Error('Failed to fetch achievement');
  }
}

export async function getStatisticsAction(): Promise<TStatistics> {
  try {
    return await achievementApi.getStatistics();
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    throw new Error('Failed to fetch statistics');
  }
}

export async function updateStarredAction(
  data: TUpdateStarred
): Promise<TAchievement> {
  try {
    return await achievementApi.updateStarred(data);
  } catch (error) {
    console.error('Failed to update starred status:', error);
    throw new Error('Failed to update starred status');
  }
}

export async function bulkUpdateStarredAction(
  data: TBulkUpdateStarred
): Promise<TAchievement[]> {
  try {
    return await achievementApi.bulkUpdateStarred(data);
  } catch (error) {
    console.error('Failed to bulk update starred status:', error);
    throw new Error('Failed to bulk update starred status');
  }
}

export async function shareAchievementAction(
  data: TShareAchievement
): Promise<{ url: string; message?: string }> {
  try {
    return await achievementApi.shareAchievement(data);
  } catch (error) {
    console.error('Failed to share achievement:', error);
    throw new Error('Failed to share achievement');
  }
}

export async function getCollectionsAction(): Promise<TCollectionListResponse> {
  try {
    return await achievementApi.getCollections();
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    throw new Error('Failed to fetch collections');
  }
}

export async function exportAchievementsAction(
  data: TExportRequest
): Promise<Blob> {
  try {
    return await achievementApi.exportAchievements(data);
  } catch (error) {
    console.error('Failed to export achievements:', error);
    throw new Error('Failed to export achievements');
  }
}

export async function getSuggestionsAction(): Promise<TAchievement[]> {
  try {
    return await achievementApi.getSuggestions();
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    throw new Error('Failed to fetch suggestions');
  }
}

export async function markNotificationSeenAction(
  achievementId: string
): Promise<void> {
  try {
    return await achievementApi.markNotificationSeen(achievementId);
  } catch (error) {
    console.error('Failed to mark notification as seen:', error);
    throw new Error('Failed to mark notification as seen');
  }
}

export async function getLeaderboardAction(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  leaderboard: Array<{
    userId: string;
    username: string;
    points: number;
    achievementCount: number;
    rank: number;
  }>;
  currentUser: {
    rank: number;
    points: number;
  };
}> {
  try {
    return await achievementApi.getLeaderboard(params);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    throw new Error('Failed to fetch leaderboard');
  }
}
