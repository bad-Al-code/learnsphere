'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getLearningRecommendationsAction,
  getPredictiveChartAction,
} from '../actions/analytics.action';

export const usePredictiveChart = () => {
  return useQuery({
    queryKey: ['analytics', 'predictive-chart'],

    queryFn: async () => {
      const res = await getPredictiveChartAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useLearningRecommendations = () => {
  return useQuery({
    queryKey: ['analytics', 'learning-recommendations'],

    queryFn: async () => {
      const res = await getLearningRecommendationsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};
