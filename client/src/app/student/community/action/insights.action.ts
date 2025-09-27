'use server';

import { getCommunityInsights } from '../api/insights.api';

export const getCommunityInsightsAction = async () => {
  try {
    return { data: await getCommunityInsights() };
  } catch (error) {
    return { error: 'Could not retrieve community insights.' };
  }
};
