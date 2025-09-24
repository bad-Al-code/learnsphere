'use client';

import { useQuery } from '@tanstack/react-query';

import { getDiscussions, getMyDrafts } from '../api/draft.api';

export const useDrafts = () => {
  return useQuery({
    queryKey: ['assignment-drafts'],

    queryFn: getMyDrafts,
  });
};

export const useDiscussions = (courseId: string) => {
  return useQuery({
    queryKey: ['assignment-discussions', courseId],

    queryFn: () => getDiscussions(courseId),
    enabled: !!courseId,
  });
};
