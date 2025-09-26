import { communityService } from '@/lib/api/server';
import { StudyRoomsPaginatedResponse } from '../schema/study-rooms.schema';

export const getStudyRooms = (params: {
  query?: string;
  topic?: string;
  limit?: number;
  cursor?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('q', params.query);
  if (params.topic && params.topic !== 'all')
    searchParams.set('topic', params.topic);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.cursor) searchParams.set('cursor', params.cursor);

  return communityService.getTyped<StudyRoomsPaginatedResponse>(
    `/api/community/study-rooms?${searchParams.toString()}`
  );
};
