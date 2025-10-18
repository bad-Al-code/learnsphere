import { getCourseRecommendations } from '../api/analytics.api.client';

/**
 * Server action to fetch AI-powered course recommendations.
 * @returns An object with either the data or an error message.
 */
export const getCourseRecommendationsAction = async () => {
  try {
    const data = await getCourseRecommendations();

    console.log(data);
    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
