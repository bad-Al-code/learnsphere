'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyEnrollmentsAction } from '../actions/enrollment.action';
import { useEnrolledCoursesStore } from '../store';

export const useMyEnrollments = () => {
  const { q, sortBy, page, limit } = useEnrolledCoursesStore();

  const queryResult = useQuery({
    queryKey: ['my-enrollments', { q, sortBy, page, limit }],
    queryFn: async () => {
      const res = await getMyEnrollmentsAction({
        q,
        sortBy,
        page,
        limit,
      });
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  return {
    ...queryResult,
    data: queryResult.data,
  };
};
