import { userService } from '@/lib/api/client';
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

export class AchievementApiClient {
  async getAchievements(params: {
    filters?: TFilter;
    sort?: TSortOption;
    page?: number;
    limit?: number;
  }): Promise<TAchievementListResponse> {
    const queryParams = new URLSearchParams();

    if (params.filters?.search) {
      queryParams.append('search', params.filters.search);
    }
    if (params.filters?.status && params.filters.status.length > 0) {
      queryParams.append('status', params.filters.status.join(','));
    }
    if (params.filters?.category && params.filters.category.length > 0) {
      queryParams.append('category', params.filters.category.join(','));
    }
    if (params.filters?.difficulty && params.filters.difficulty.length > 0) {
      queryParams.append('difficulty', params.filters.difficulty.join(','));
    }
    if (params.filters?.rarity && params.filters.rarity.length > 0) {
      queryParams.append('rarity', params.filters.rarity.join(','));
    }
    if (params.filters?.starred !== undefined) {
      queryParams.append('starred', params.filters.starred.toString());
    }
    if (params.filters?.showHidden) {
      queryParams.append('showHidden', params.filters.showHidden.toString());
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const path = `/achievements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return userService.getTyped<TAchievementListResponse>(path);
  }

  async getAchievement(id: string): Promise<TAchievement> {
    return userService.getTyped<TAchievement>(`/achievements/${id}`);
  }
  async getStatistics(): Promise<TStatistics> {
    return userService.getTyped<TStatistics>('/achievements/statistics');
  }

  async updateStarred(data: TUpdateStarred): Promise<TAchievement> {
    return userService.patchTyped<TAchievement>(
      `/achievements/${data.achievementId}/star`,
      { isStarred: data.isStarred }
    );
  }

  async bulkUpdateStarred(data: TBulkUpdateStarred): Promise<TAchievement[]> {
    return userService.patchTyped<TAchievement[]>(
      '/achievements/bulk/star',
      data
    );
  }

  async shareAchievement(
    data: TShareAchievement
  ): Promise<{ url: string; message?: string }> {
    return userService.postTyped<{ url: string; message?: string }>(
      `/achievements/${data.achievementId}/share`,
      { platform: data.platform }
    );
  }

  async getCollections(): Promise<TCollectionListResponse> {
    return userService.getTyped<TCollectionListResponse>(
      '/achievements/collections'
    );
  }

  async exportAchievements(data: TExportRequest): Promise<Blob> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/achievements/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  async getSuggestions(): Promise<TAchievement[]> {
    return userService.getTyped<TAchievement[]>('/achievements/suggestions');
  }

  async markNotificationSeen(achievementId: string): Promise<void> {
    return userService.postTyped<void>(
      `/achievements/${achievementId}/notification/seen`,
      {}
    );
  }

  async getLeaderboard(params?: { page?: number; limit?: number }): Promise<{
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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const path = `/achievements/leaderboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return userService.getTyped(path);
  }
}

export const achievementApi = new AchievementApiClient();
