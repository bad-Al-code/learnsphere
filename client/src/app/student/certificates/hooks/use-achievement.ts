import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import {
  bulkUpdateStarredAction,
  exportAchievementsAction,
  getAchievementAction,
  getAchievementsAction,
  getCollectionsAction,
  getLeaderboardAction,
  getStatisticsAction,
  getSuggestionsAction,
  markNotificationSeenAction,
  shareAchievementAction,
  updateStarredAction,
} from '../action/achievement.action';
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

export const achievementKeys = {
  all: ['achievements'] as const,
  lists: () => [...achievementKeys.all, 'list'] as const,
  list: (params: {
    filters?: TFilter;
    sort?: TSortOption;
    page?: number;
    limit?: number;
  }) => [...achievementKeys.lists(), params] as const,
  details: () => [...achievementKeys.all, 'detail'] as const,
  detail: (id: string) => [...achievementKeys.details(), id] as const,
  statistics: () => [...achievementKeys.all, 'statistics'] as const,
  collections: () => [...achievementKeys.all, 'collections'] as const,
  suggestions: () => [...achievementKeys.all, 'suggestions'] as const,
  leaderboard: (params?: { page?: number; limit?: number }) =>
    [...achievementKeys.all, 'leaderboard', params] as const,
};

export function useAchievements(
  params: {
    filters?: TFilter;
    sort?: TSortOption;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<TAchievementListResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<TAchievementListResponse>({
    queryKey: achievementKeys.list(params),
    queryFn: () => getAchievementsAction(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useAchievement(
  id: string,
  options?: Omit<UseQueryOptions<TAchievement>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TAchievement>({
    queryKey: achievementKeys.detail(id),
    queryFn: () => getAchievementAction(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useStatistics(
  options?: Omit<UseQueryOptions<TStatistics>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TStatistics>({
    queryKey: achievementKeys.statistics(),
    queryFn: () => getStatisticsAction(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useCollections(
  options?: Omit<
    UseQueryOptions<TCollectionListResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<TCollectionListResponse>({
    queryKey: achievementKeys.collections(),
    queryFn: () => getCollectionsAction(),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useSuggestions(
  options?: Omit<UseQueryOptions<TAchievement[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TAchievement[]>({
    queryKey: achievementKeys.suggestions(),
    queryFn: () => getSuggestionsAction(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useLeaderboard(
  params?: { page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<{
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
    }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: achievementKeys.leaderboard(params),
    queryFn: () => getLeaderboardAction(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useUpdateStarred() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TUpdateStarred) => updateStarredAction(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: achievementKeys.lists() });
      await queryClient.cancelQueries({
        queryKey: achievementKeys.detail(data.achievementId),
      });

      const previousLists = queryClient.getQueriesData({
        queryKey: achievementKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData(
        achievementKeys.detail(data.achievementId)
      );

      queryClient.setQueriesData<TAchievementListResponse>(
        { queryKey: achievementKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            achievements: old.achievements.map((ach) =>
              ach.id === data.achievementId
                ? { ...ach, isStarred: data.isStarred }
                : ach
            ),
          };
        }
      );

      queryClient.setQueryData<TAchievement>(
        achievementKeys.detail(data.achievementId),
        (old) => {
          if (!old) return old;
          return { ...old, isStarred: data.isStarred };
        }
      );

      return { previousLists, previousDetail };
    },
    onError: (err, data, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          achievementKeys.detail(data.achievementId),
          context.previousDetail
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.statistics() });
    },
  });
}

export function useBulkUpdateStarred() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TBulkUpdateStarred) => bulkUpdateStarredAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.statistics() });
    },
  });
}

export function useShareAchievement() {
  return useMutation({
    mutationFn: (data: TShareAchievement) => shareAchievementAction(data),
  });
}

export function useExportAchievements() {
  return useMutation({
    mutationFn: (data: TExportRequest) => exportAchievementsAction(data),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `achievements.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}

export function useMarkNotificationSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievementId: string) =>
      markNotificationSeenAction(achievementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
    },
  });
}
