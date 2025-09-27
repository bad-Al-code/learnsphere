'use client';

import { useQuery } from '@tanstack/react-query';
import { getCommunityInsightsAction } from '../action';

export const useCommunityInsights = () => {
  return useQuery({
    queryKey: ['community-insights'],

    queryFn: async () => {
      const result = await getCommunityInsightsAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: (failureCount, error) => {
      if (
        error.message.includes('400') ||
        error.message.includes('401') ||
        error.message.includes('403')
      ) {
        return false;
      }

      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: 'Failed to fetch community insights',
    },
    networkMode: 'online',
  });
};
