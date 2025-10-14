'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubmissionDetailsAction } from '../actions/submission.action';

/**
 * Fetches the details for a single submission.
 * The query is only enabled when a submissionId is provided.
 * @param submissionId The ID of the submission to fetch.
 */
export const useSubmissionDetails = (submissionId: string | null) => {
  return useQuery({
    queryKey: ['submission-details', submissionId],

    queryFn: async () => {
      if (!submissionId) {
        return null;
      }

      const res = await getSubmissionDetailsAction(submissionId);
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
    enabled: !!submissionId,
    retry: 1,
  });
};
