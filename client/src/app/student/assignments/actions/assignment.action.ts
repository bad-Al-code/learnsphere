'use server';

import {
  getMyAIRecommendations,
  getMyPendingAssignments,
} from '../api/assignment.api';

export const getMyPendingAssignmentsAction = async (query?: string) => {
  try {
    return { data: await getMyPendingAssignments(query) };
  } catch (error) {
    return { error: 'Could not load your pending assignments.' };
  }
};

export const getMyAIRecommendationsAction = async () => {
  try {
    return { data: await getMyAIRecommendations() };
  } catch (error) {
    return { error: 'Could not load AI recommendations.' };
  }
};
