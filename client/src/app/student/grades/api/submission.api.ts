import { enrollmentService } from '@/lib/api/client';
import { SubmissionDetails } from '../schema';

/**
 * Fetches the details for a single submission from the enrollment service.
 * @param submissionId The ID of the submission to fetch.
 * @returns A promise that resolves to the submission details.
 */
export const getSubmissionDetails = async (
  submissionId: string
): Promise<SubmissionDetails> => {
  try {
    const response = await enrollmentService.getTyped<SubmissionDetails>(
      `/api/analytics/submissions/${submissionId}`
    );

    return response;
  } catch (error) {
    console.error(
      `Failed to fetch details for submission ${submissionId}:`,
      error
    );
    throw new Error('Could not load submission details.');
  }
};
