'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMyGradesAction } from '../actions/analytics.action';
import { useGradesStore } from '../store/grades.store';

export const useGrades = () => {
  const { q, courseId, status, grade, page, limit } = useGradesStore();

  const queryResult = useQuery({
    queryKey: ['my-grades', { q, courseId, status, grade, page, limit }],

    queryFn: () =>
      getMyGradesAction({ q, courseId, status, grade, page, limit }),
    placeholderData: (previousData) => previousData,
    retry: false,
  });

  useEffect(() => {
    if (queryResult.data?.error) {
      throw new Error(queryResult.data.error);
    }
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: queryResult.data?.data,
  };
};
