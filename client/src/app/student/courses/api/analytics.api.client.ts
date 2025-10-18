import { enrollmentService } from '@/lib/api/client';
import { RecommendedCourse } from '../schema';

/**
 * Fetches AI-powered course recommendations for the current student.
 * @returns A promise that resolves to an array of recommended course objects.
 */
export const getCourseRecommendations = async (): Promise<
  RecommendedCourse[]
> => {
  try {
    const response = await enrollmentService.getTyped<RecommendedCourse[]>(
      `/api/analytics/student/recommendations`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch course recommendations:', error);
    throw new Error('Could not load course recommendations.');
  }
};
