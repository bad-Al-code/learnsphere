'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourseRecommendationsAction } from '../actions/analytics.action';

export const useCourseRecommendations = () => {
  return useQuery({
    queryKey: ['analytics', 'course-recommendations'],
    queryFn: async () => {
      const res = await getCourseRecommendationsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },

    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};
