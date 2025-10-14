import { getSubmissionDetails } from '../api/submission.api';

/**
 * Server action to get details for a single submission.
 * @param submissionId The ID of the submission.
 * @returns An object with either the data or an error message.
 */
export const getSubmissionDetailsAction = async (submissionId: string) => {
  try {
    const data = await getSubmissionDetails(submissionId);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
