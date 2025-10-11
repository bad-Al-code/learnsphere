import { enrollmentService } from '@/lib/api/client';
import { AssignmentAnalytics } from '../schemas/analytics.schema';

export const getAssignmentAnalytics = async (
  courseId: string
): Promise<AssignmentAnalytics> => {
  try {
    return await enrollmentService.getTyped<AssignmentAnalytics>(
      `/api/analytics/student/assignments/${courseId}`
    );
  } catch (error) {
    console.error('Error fetching assignment analytics:', error);
    throw new Error('Failed to fetch assignment analytics.');
  }
};
