'use client';

import { useQuery } from '@tanstack/react-query';
import { getPredictiveChartAction } from '../actions/analytics.action';

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
