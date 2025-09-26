import {
  communityService as clientCommunityService,
  courseService,
} from '@/lib/api/client';
import { Category } from '@/types/category';
import { CreateStudyRoomInput, StudyRoom } from '../schema/study-rooms.schema';

export const createStudyRoom = async (
  data: CreateStudyRoomInput
): Promise<StudyRoom> => {
  const payload = {
    ...data,
    isLive: data.sessionType === 'now',
    tags: data.tags
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };

  console.log(payload);

  const response = await clientCommunityService.postTyped<StudyRoom>(
    `/api/community/study-rooms`,
    payload
  );

  return response;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await courseService.get<Category[]>(`/api/categories/list`);

  return response.data;
};
