'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyStudyGoalsAction } from '../actions/study-goal.action';

export const useMyStudyGoals = () => {
  return useQuery({
    queryKey: ['study-goals'],

    queryFn: async () => {
      const result = await getMyStudyGoalsAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
