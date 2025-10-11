'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignmentAnalyticsAction } from '../actions/analytics.action';

export const useAssignmentAnalytics = (courseId: string) => {
  return useQuery({
    queryKey: ['assignment-analytics', courseId],

    queryFn: async () => {
      const res = await getAssignmentAnalyticsAction(courseId);
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },

    enabled: !!courseId,
  });
};
