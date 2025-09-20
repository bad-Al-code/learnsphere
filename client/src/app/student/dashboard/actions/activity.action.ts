'use server';

import { getLiveActivityFeed, getStudyGroups } from '../api/activity.api';

export const getLiveActivityFeedAction = async () => {
  try {
    return { data: await getLiveActivityFeed() };
  } catch (error) {
    return { error: 'Could not retrieve live activity.' };
  }
};

export const getStudyGroupsAction = async () => {
  try {
    return { data: await getStudyGroups() };
  } catch (error) {
    return { error: 'Could not retrieve study groups.' };
  }
};
