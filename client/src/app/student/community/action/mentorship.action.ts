'use server';

import { getMentorshipPrograms } from '../api/mentorship.api.server';

export const getMentorshipProgramsAction = async (params: {
  query?: string;
  status?: string;
  isFree?: boolean;
  isFavorite?: boolean;
  limit?: number;
  cursor?: string;
}) => {
  try {
    return { data: await getMentorshipPrograms(params) };
  } catch (error) {
    return { error: 'Could not retrieve mentorship programs.' };
  }
};
