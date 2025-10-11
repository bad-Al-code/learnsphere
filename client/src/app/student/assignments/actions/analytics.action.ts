import { getAssignmentAnalytics } from '../api/analytics.api';

export const getAssignmentAnalyticsAction = async (courseId: string) => {
  try {
    const data = await getAssignmentAnalytics(courseId);

    console.log(data);
    return { data };
  } catch (error) {
    return { error: 'Failed to fetch assignment analytics.' };
  }
};
