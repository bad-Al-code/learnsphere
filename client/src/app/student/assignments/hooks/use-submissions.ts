'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  getMyAIFeedback,
  getMySubmittedAssignments,
  requestRecheck,
} from '../api/submission.api';

export const useSubmittedAssignments = () => {
  return useQuery({
    queryKey: ['submitted-assignments'],
    queryFn: getMySubmittedAssignments,
  });
};

export const useAIFeedback = () => {
  const { data: feedbackData, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['ai-feedback'],
    queryFn: getMyAIFeedback,
  });

  const { data: assignments, isLoading: isLoadingAssignments } =
    useSubmittedAssignments();

  const enrichedFeedback = useMemo(() => {
    if (!feedbackData || !assignments) return [];

    const assignmentMap = new Map(assignments.map((a) => [a.id, a.title]));

    return feedbackData.map((f) => ({
      ...f,
      title: assignmentMap.get(f.submissionId) || 'Assignment Feedback',
    }));
  }, [feedbackData, assignments]);

  return {
    data: enrichedFeedback,
    isLoading: isLoadingFeedback || isLoadingAssignments,
  };
};

export const useRequestRecheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestRecheck,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ['ai-feedback'] });
    },

    onError: (error) => {
      toast.error('Failed to request recheck.', { description: error.message });
    },
  });
};
