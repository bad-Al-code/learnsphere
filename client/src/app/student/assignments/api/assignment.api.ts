import { courseService, enrollmentService } from '@/lib/api/server';
import {
  AIRecommendation,
  PendingAssignment,
} from '../schemas/assignment.schema';
import { AssignmentStatusFilter } from '../stores/assignment.store';

export const getMyPendingAssignments = (params: {
  query?: string;
  status?: AssignmentStatusFilter;
}): Promise<PendingAssignment[]> => {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('q', params.query);
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status);

  return courseService.getTyped<PendingAssignment[]>(
    `/api/assignments/my-pending?${searchParams.toString()}`
  );
};

export const getMyAIRecommendations = (): Promise<AIRecommendation[]> => {
  return enrollmentService.getTyped<AIRecommendation[]>(
    '/api/analytics/my-study-recommendations'
  );
};
