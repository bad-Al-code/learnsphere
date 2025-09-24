'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { createDraftAction, deleteDraftAction } from '../actions/draft.action';
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

export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraftAction,

    onSuccess: (result) => {
      if (result.data) {
        toast.success('Draft created successfully!');

        queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
      } else if (result.error) {
        toast.error('Failed to create draft', { description: result.error });
      }
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraftAction,

    onSuccess: (result) => {
      if (!result.error) {
        toast.success('Draft deleted.');

        queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
      } else {
        toast.error('Failed to delete draft', { description: result.error });
      }
    },
  });
};
