import { enrollmentService } from '@/lib/api/client';
import { GetMyEnrolledCoursesResponse } from '../schema';
import { SortOption } from '../store';

export const getMyEnrollments = async (options: {
  q?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}): Promise<GetMyEnrolledCoursesResponse> => {
  try {
    const params = new URLSearchParams();
    if (options.q) params.append('q', options.q);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const response =
      await enrollmentService.getTyped<GetMyEnrolledCoursesResponse>(
        `/api/enrollments/my-courses?${params.toString()}`
      );

    return response;
  } catch (error) {
    console.error('Failed to fetch my enrollments:', error);
    throw new Error('Could not load your courses.');
  }
};
