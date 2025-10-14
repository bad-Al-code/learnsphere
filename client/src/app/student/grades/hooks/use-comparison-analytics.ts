'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getComparisonAnalyticsAction,
  getPerformanceHighlightsAction,
} from '../actions/analytics.action';

export const useComparisonAnalytics = (courseId: string) => {
  return useQuery({
    queryKey: ['comparison-analytics', courseId],

    queryFn: async () => {
      const res = await getComparisonAnalyticsAction(courseId);
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    enabled: !!courseId,
    retry: 1,
  });
};

export const usePerformanceHighlights = (courseId: string) => {
  return useQuery({
    queryKey: ['performance-highlights', courseId],

    queryFn: async () => {
      const res = await getPerformanceHighlightsAction(courseId);
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};
