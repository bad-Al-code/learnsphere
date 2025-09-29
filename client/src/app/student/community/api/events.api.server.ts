import { communityService } from '@/lib/api/server';
import { EventsPaginatedResponse } from '../schema';

export const getEvents = (params: {
  query?: string;
  type?: string;
  limit?: number;
  cursor?: string;
}): Promise<EventsPaginatedResponse> => {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('q', params.query);
  if (params.type && params.type !== 'all')
    searchParams.set('type', params.type);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.cursor) searchParams.set('cursor', params.cursor);

  return communityService.getTyped(
    `/api/community/events?${searchParams.toString()}`
  );
};
