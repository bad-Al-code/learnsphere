'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAIProgressInsightsAction,
  getLearningEfficiencyAction,
  getLearningMilestonesAction,
  getLearningRecommendationsAction,
  getModuleCompletionAction,
  getPredictiveChartAction,
  getStudyHabitsAction,
  getStudyTimeTrendAction,
  getTimeManagementAction,
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

export const useStudyTimeTrend = () => {
  return useQuery({
    queryKey: ['analytics', 'study-time-trend'],

    queryFn: async () => {
      const res = await getStudyTimeTrendAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useModuleCompletion = () => {
  return useQuery({
    queryKey: ['analytics', 'module-completion'],

    queryFn: async () => {
      const res = await getModuleCompletionAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useAIProgressInsights = () => {
  return useQuery({
    queryKey: ['analytics', 'ai-progress-insights'],

    queryFn: async () => {
      const res = await getAIProgressInsightsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useLearningMilestones = () => {
  return useQuery({
    queryKey: ['analytics', 'learning-milestones'],

    queryFn: async () => {
      const res = await getLearningMilestonesAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useStudyHabits = () => {
  return useQuery({
    queryKey: ['analytics', 'study-habits'],

    queryFn: async () => {
      const res = await getStudyHabitsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useLearningEfficiency = () => {
  return useQuery({
    queryKey: ['analytics', 'learning-efficiency'],

    queryFn: async () => {
      const res = await getLearningEfficiencyAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useTimeManagement = () => {
  return useQuery({
    queryKey: ['analytics', 'time-management'],

    queryFn: async () => {
      const res = await getTimeManagementAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
