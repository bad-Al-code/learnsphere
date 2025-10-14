'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAIFeedbackAction,
  requestReGradeAction,
} from '../actions/feedback.action';

export const useAIFeedback = (submissionId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['ai-feedback', submissionId],
    queryFn: async () => {
      const res = await getAIFeedbackAction();
      if (res.error) {
        throw new Error(res.error);
      }

      const feedbackForItem = res.data?.find(
        (f) => f.submissionId === submissionId
      );

      return feedbackForItem || null;
    },
    enabled: !!submissionId && enabled,
    retry: 1,
  });
};

export const useRequestReGrade = () => {
  return useMutation({
    mutationFn: (submissionId: string) => requestReGradeAction(submissionId),

    onMutate: () => {
      toast.loading('Submitting re-grade request...');
    },

    onSuccess: (res) => {
      toast.dismiss();
      if (res.data) {
        toast.success('Re-grade requested', {
          description: res.data.message,
        });
      } else {
        toast.error('Failed to request re-grade', {
          description: res.error,
        });
      }
    },
    onError: (error: Error) => {
      toast.dismiss();
      toast.error('Request failed', {
        description: error.message,
      });
    },
  });
};
