import { getAIFeedback, requestReGrade } from '../api/feedback.api.client';

export const getAIFeedbackAction = async () => {
  try {
    const data = await getAIFeedback();
    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const requestReGradeAction = async (submissionId: string) => {
  try {
    const data = await requestReGrade(submissionId);
    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
