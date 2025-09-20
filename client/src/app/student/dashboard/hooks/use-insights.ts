'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getMyAIInsightsAction,
  getMyStudyTrendAction,
} from '../actions/analytics.action';

export const useStudyTimeTrend = () => {
  return useQuery({
    queryKey: ['study-time-trend'],

    queryFn: async () => {
      const result = await getMyStudyTrendAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      const result = await getMyAIInsightsAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
