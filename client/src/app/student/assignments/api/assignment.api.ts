import { courseService, enrollmentService } from '@/lib/api/server';
import {
  AIRecommendation,
  PendingAssignment,
} from '../schemas/assignment.schema';

export const getMyPendingAssignments = (
  query?: string
): Promise<PendingAssignment[]> => {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('q', query);

  return courseService.getTyped<PendingAssignment[]>(
    `/api/assignments/my-pending?${searchParams.toString()}`
  );
};

export const getMyAIRecommendations = (): Promise<AIRecommendation[]> => {
  return enrollmentService.getTyped<AIRecommendation[]>(
    '/api/analytics/my-study-recommendations'
  );
};
