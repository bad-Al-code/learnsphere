import { getMyEnrollments } from '../api/enrollment.api.client';
import { SortOption } from '../store';

export const getMyEnrollmentsAction = async (options: {
  q?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}) => {
  try {
    const data = await getMyEnrollments(options);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
