'use server';

import { getEvents } from '../api/events.api.server';

export const getEventsAction = async (params: {
  query?: string;
  type?: string;
  limit?: number;
  cursor?: string;
}) => {
  try {
    return { data: await getEvents(params) };
  } catch (error) {
    return { error: 'Could not retrieve events.' };
  }
};
