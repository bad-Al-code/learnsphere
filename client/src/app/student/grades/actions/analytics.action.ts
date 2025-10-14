import {
  getComparisonAnalytics,
  getMyGrades,
  getPerformanceHighlights,
  getPredictiveChart,
} from '../api/analytics.api.client';
import { GradesFilters } from '../schema';

/**
 * Server action to fetch the current user's grades.
 * @param filters - The query filters for the request.
 * @returns An object with either the data or an error message.
 */
export const getMyGradesAction = async (filters: GradesFilters) => {
  try {
    const data = await getMyGrades(filters);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getComparisonAnalyticsAction = async (courseId: string) => {
  try {
    const data = await getComparisonAnalytics(courseId);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getPerformanceHighlightsAction = async (courseId: string) => {
  try {
    const data = await getPerformanceHighlights(courseId);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getPredictiveChartAction = async () => {
  try {
    const data = await getPredictiveChart();

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
