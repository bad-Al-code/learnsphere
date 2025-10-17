import { courseService } from '@/lib/api/client';
import { AIFeedback, SubmittedAssignment } from '../schemas/submission.schema';

export const getMySubmittedAssignments = async (): Promise<
  SubmittedAssignment[]
> => {
  const response = await courseService.get<SubmittedAssignment[]>(
    '/api/assignments/my-submitted'
  );

  return response.data;
};

export const getMyAIFeedback = async (): Promise<AIFeedback[]> => {
  const response = await courseService.get<AIFeedback[]>('/api/ai/my-feedback');

  return response.data;
};

export const requestRecheck = async (
  submissionId: string
): Promise<{ message: string }> => {
  const response = await courseService.post<{ message: string }>(
    `/api/ai/${submissionId}/recheck`,
    {}
  );

  return response.data;
};
