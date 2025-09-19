'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyAverageGradeAction } from '../actions/stats.action';

export const useMyAverageGrade = () => {
  return useQuery({
    queryKey: ['average-grade'],

    queryFn: async () => {
      const result = await getMyAverageGradeAction();
      console.log(result);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};
