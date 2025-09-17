'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAssignmentAction,
  deleteAssignmentAction,
  generateDraftAction,
  getFeedbackAction,
  getWritingAssignmentsAction,
  updateAssignmentAction,
} from '../actions/writing';
import { WritingAssignment } from '../schemas/writing.schema';

export const useGetWritingAssignments = (courseId: string) => {
  return useQuery({
    queryKey: ['writing-assignments', courseId],

    queryFn: async () => {
      const result = await getWritingAssignmentsAction(courseId);
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    enabled: !!courseId,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssignmentAction,

    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['writing-assignments', variables.courseId],
        });
      }
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssignmentAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(
          ['writing-assignments', result.data.courseId],
          (oldData: WritingAssignment[] | undefined) =>
            oldData?.map((a) => (a.id === result.data!.id ? result.data : a))
        );
      }
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssignmentAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writing-assignments'] });
    },
  });
};

export const useGenerateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateDraftAction,

    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['writing-assignments', variables.courseId],
        });
      }
    },
  });
};

export const useGetFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getFeedbackAction,

    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['writing-assignments'] });
    },
  });
};
