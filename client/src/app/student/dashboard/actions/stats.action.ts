'use server';

import {
  getDueSoonCount,
  getMyAverageGrade,
  getMyStudyStreak,
  getPendingAssignmentsCount,
} from '../api/stats.api';

export const getMyAverageGradeAction = async () => {
  try {
    const data = await getMyAverageGrade();

    return { data };
  } catch (error) {
    console.error('Failed to fetch average grade:', error);

    return { error: 'Could not retrieve your average grade.' };
  }
};

export const getDueSoonCountAction = async () => {
  try {
    const data = await getDueSoonCount();

    return { data };
  } catch (error) {
    console.error('Failed to fetch due soon count:', error);

    return { error: 'Could not retrieve due soon count.' };
  }
};

export const getMyStudyStreakAction = async () => {
  try {
    return { data: await getMyStudyStreak() };
  } catch (error) {
    console.error('Failed to fetch study streak:', error);

    return { error: 'Could not retrieve your study streak.' };
  }
};

export const getPendingAssignmentsCountAction = async () => {
  try {
    return { data: await getPendingAssignmentsCount() };
  } catch (error) {
    return { error: 'Could not retrieve pending assignments count.' };
  }
};
