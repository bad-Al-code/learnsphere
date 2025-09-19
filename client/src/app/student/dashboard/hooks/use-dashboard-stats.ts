'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getDueSoonCountAction,
  getMyAverageGradeAction,
  getMyStudyStreakAction,
  getPendingAssignmentsCountAction,
} from '../actions/stats.action';

export const useMyAverageGrade = () => {
  return useQuery({
    queryKey: ['average-grade'],

    queryFn: async () => {
      const result = await getMyAverageGradeAction();
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};

export const useDueSoonCount = () => {
  return useQuery({
    queryKey: ['assignments-due-soon'],

    queryFn: async () => {
      const result = await getDueSoonCountAction();
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};

export const useMyStudyStreak = () => {
  return useQuery({
    queryKey: ['study-streak'],

    queryFn: async () => {
      const result = await getMyStudyStreakAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};

export const usePendingAssignmentsCount = () => {
  return useQuery({
    queryKey: ['pending-assignments'],

    queryFn: async () => {
      const result = await getPendingAssignmentsCountAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
