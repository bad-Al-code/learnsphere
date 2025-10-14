import { courseService } from '@/lib/api/client';
import { AIFeedback, ReGradeResponse } from '../schema';

/**
 * Fetches all AI feedback for the current user.
 * @returns A promise that resolves to an array of AI feedback records.
 */
export const getAIFeedback = async (): Promise<AIFeedback[]> => {
  try {
    const response = await courseService.getTyped<AIFeedback[]>(
      '/api/ai/my-feedback'
    );

    console.log('My feedback', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch AI feedback:', error);
    throw new Error('Could not load AI feedback.');
  }
};

/**
 * Requests a re-grade for a specific submission.
 * @param submissionId The ID of the submission to re-grade.
 * @returns A promise that resolves with a success message.
 */
export const requestReGrade = async (
  submissionId: string
): Promise<ReGradeResponse> => {
  try {
    const response = await courseService.postTyped<ReGradeResponse>(
      `/api/ai/${submissionId}/recheck`,
      {}
    );

    console.log('Request ReGrade', response);
    return response;
  } catch (error) {
    console.error('Failed to request re-grade:', error);
    throw new Error('Could not request a re-grade at this time.');
  }
};
