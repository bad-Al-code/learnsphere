import { communityService as clientCommunityService } from '@/lib/api/client';
import {
  CreateEventInput,
  EventAttendee,
  RegistrationResponse,
  RegistrationStatus,
  TEvent,
  UpdateEventInput,
  UpdateEventPayload,
} from '../schema';

export const createEvent = async (data: CreateEventInput): Promise<TEvent> => {
  const payload = {
    ...data,
    tags: data.tags
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    date: data.date.toISOString(),
  };
  console.log('Creating event with payload:', payload);

  const response = await clientCommunityService.post<TEvent>(
    '/api/community/events',
    payload
  );

  console.log('API Response:', response);
  console.log('Response data:', response.data);

  return response.data;
};

export const updateEvent = async (
  eventId: string,
  data: UpdateEventInput
): Promise<TEvent> => {
  const payload: UpdateEventPayload = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.type !== undefined) payload.type = data.type;
  if (data.date !== undefined) payload.date = data.date.toISOString();
  if (data.location !== undefined) payload.location = data.location;
  if (data.maxAttendees !== undefined) payload.maxAttendees = data.maxAttendees;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.prize !== undefined) payload.prize = data.prize;

  const response = await clientCommunityService.put<TEvent>(
    `/api/community/events/${eventId}`,
    payload
  );

  return response.data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await clientCommunityService.deleteTyped<void>(
    `/api/community/events/${eventId}`
  );
};

export const registerForEvent = async (
  eventId: string
): Promise<RegistrationResponse> => {
  return clientCommunityService.postTyped<RegistrationResponse>(
    `/api/community/events/${eventId}/register`,
    {}
  );
};

export const unregisterFromEvent = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  return clientCommunityService.deleteTyped<{
    success: boolean;
    message: string;
  }>(`/api/community/events/${eventId}/register`);
};

export const checkRegistrationStatus = async (
  eventId: string
): Promise<RegistrationStatus> => {
  return clientCommunityService.getTyped<RegistrationStatus>(
    `/api/community/events/${eventId}/registration-status`
  );
};

export const getEventAttendees = async (
  eventId: string
): Promise<EventAttendee[]> => {
  const response = await clientCommunityService.get<EventAttendee[]>(
    `/api/community/events/${eventId}/attendees`
  );

  console.debug('Response Data', response.data);
  return response.data;
};
