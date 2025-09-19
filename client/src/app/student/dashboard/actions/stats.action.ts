'use server';

import { getMyAverageGrade } from '../api/stats.api';

export const getMyAverageGradeAction = async () => {
  try {
    const data = await getMyAverageGrade();

    return { data };
  } catch (error) {
    console.error('Failed to fetch average grade:', error);

    return { error: 'Could not retrieve your average grade.' };
  }
};
