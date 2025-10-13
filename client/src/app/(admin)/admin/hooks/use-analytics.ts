'use client';

import { useQuery } from '@tanstack/react-query';
import { getWaitlistAnalyticsAction } from '../action/analytics.action';
const interestColors = [
  'var(--color-neutral-100)',
  'var(--color-neutral-200)',
  'var(--color-neutral-300)',
  'var(--color-neutral-400)',
  'var(--color-neutral-500)',
  'var(--color-neutral-600)',
  'var(--color-neutral-700)',
];

const roleColors = {
  student: 'var(--color-neutral-100)',
  instructor: 'var(--color-neutral-500)',
};

export const useWaitlistAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'waitlist-analytics'],
    queryFn: async () => {
      const res = await getWaitlistAnalyticsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    select: (data) => {
      if (!data) return undefined;

      return {
        ...data,
        interestDistribution: data.interestDistribution.map((item, index) => ({
          name: item.interest,
          value: item.count,
          fill: interestColors[index % interestColors.length],
        })),

        roleDistribution: data.roleDistribution.map((item) => ({
          name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
          value: item.count,
          fill:
            roleColors[item.role as keyof typeof roleColors] ||
            'var(--color-neutral-700)',
        })),
      };
    },
  });
};
