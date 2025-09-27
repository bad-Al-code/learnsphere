'use server';

import { getDiscussions } from '../api/discussion.api';

export const getDiscussionsAction = async (courseId: string) => {
  try {
    return { data: await getDiscussions(courseId) };
  } catch (error) {
    return { error: 'Could not retrieve discussions.' };
  }
};
