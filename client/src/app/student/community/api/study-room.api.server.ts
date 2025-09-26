import { communityService } from '@/lib/api/server';
import { StudyRoom } from '../schema/study-rooms.schema';

export const getStudyRooms = (params: {
  query?: string;
  topic?: string;
}): Promise<StudyRoom[]> => {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set('q', params.query);
  if (params.topic && params.topic !== 'all')
    searchParams.set('topic', params.topic);

  return communityService.getTyped<StudyRoom[]>(
    `/api/community/study-rooms?${searchParams.toString()}`
  );
};
