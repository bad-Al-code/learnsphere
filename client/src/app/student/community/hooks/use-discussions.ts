'use client';

import { useQuery } from '@tanstack/react-query';
import { getDiscussionsAction } from '../action';

export const useDiscussions = (courseId: string) => {
  return useQuery({
    queryKey: ['discussions', courseId],

    queryFn: async () => {
      const result = await getDiscussionsAction(courseId);
      if (result.error) throw new Error(result.error);

      return result.data;
    },
    enabled: !!courseId,
  });
};
