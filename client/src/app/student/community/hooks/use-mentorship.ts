'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMentorshipProgramsAction } from '../action';

export const useMentorships = (filters: {
  query?: string;
  status?: string;
  isFree?: boolean;
  isFavorite?: boolean;
}) => {
  const { query, status, isFree, isFavorite } = filters;

  return useInfiniteQuery({
    queryKey: ['mentorships', query, status, isFree, isFavorite],

    queryFn: async ({ pageParam }) => {
      const result = await getMentorshipProgramsAction({
        ...filters,
        cursor: pageParam,
      });
      if (result.error) throw new Error(result.error);

      console.log(result.data);
      return result.data;
    },

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};
