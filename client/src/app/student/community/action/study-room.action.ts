'use server';

import { getStudyRooms } from '../api/study-room.api.server';

export const getStudyRoomsAction = async (params: {
  query?: string;
  topic?: string;
}) => {
  try {
    return { data: await getStudyRooms(params) };
  } catch (error) {
    return { error: 'Could not retrieve study rooms.' };
  }
};
