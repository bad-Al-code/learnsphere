'use server';

import { getWaitlistAnalytics } from '../api/analytics.api';

export const getWaitlistAnalyticsAction = async () => {
  try {
    const data = await getWaitlistAnalytics();

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
