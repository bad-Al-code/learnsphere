'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteFindingAction,
  getResearchBoardAction,
  performResearchAction,
  saveFindingAction,
  summarizeFindingAction,
  updateFindingNotesAction,
} from '../actions/research';

export const usePerformResearch = () => {
  return useMutation({
    mutationFn: performResearchAction,
  });
};

export const useGetResearchBoard = (courseId: string) => {
  return useQuery({
    queryKey: ['research-board', courseId],

    queryFn: async () => {
      const result = await getResearchBoardAction(courseId);
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    enabled: !!courseId,
  });
};

export const useSaveFinding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveFindingAction,

    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['research-board', variables.courseId],
        });
      }
    },
  });
};

export const useUpdateFindingNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFindingNotesAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['research-board'] });
      }
    },
  });
};

export const useDeleteFinding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFindingAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-board'] });
    },
  });
};

export const useSummarizeFinding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: summarizeFindingAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['research-board'] });
      }
    },
  });
};
