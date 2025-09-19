'use server';

import { getMyStudyGoals } from '../api/study-goal.api';

export const getMyStudyGoalsAction = async () => {
  try {
    return { data: await getMyStudyGoals() };
  } catch (error) {
    console.error('Failed to fetch study goals:', error);

    return { error: 'Could not retrieve your study goals.' };
  }
};
