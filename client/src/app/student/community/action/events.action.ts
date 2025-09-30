'use server';

import {
  checkRegistrationStatus as checkRegistrationStatusApi,
  registerForEvent as registerForEventApi,
  unregisterFromEvent as unregisterFromEventApi,
} from '../api/events.api.client';
import { getEvents } from '../api/events.api.server';

export const getEventsAction = async (params: {
  query?: string;
  type?: string;
  limit?: number;
  cursor?: string;
  attending?: boolean;
}) => {
  try {
    return { data: await getEvents(params) };
  } catch (error) {
    return { error: 'Could not retrieve events.' };
  }
};

export const registerForEventAction = async (eventId: string) => {
  try {
    const data = await registerForEventApi(eventId);
    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to register for event.',
    };
  }
};

export const unregisterFromEventAction = async (eventId: string) => {
  try {
    const data = await unregisterFromEventApi(eventId);
    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to unregister from event.',
    };
  }
};

export const checkRegistrationStatusAction = async (eventId: string) => {
  try {
    const data = await checkRegistrationStatusApi(eventId);
    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to check registration status.',
    };
  }
};
