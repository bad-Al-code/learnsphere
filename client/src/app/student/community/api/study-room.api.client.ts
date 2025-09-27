import {
  communityService as clientCommunityService,
  courseService,
} from '@/lib/api/client';
import { Category } from '@/types/category';
import { GenerateShareLinkInput } from '../schema';
import {
  CreateStudyRoomInput,
  StudyRoom,
  UpdateStudyRoomInput,
} from '../schema/study-rooms.schema';

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

export const joinStudyRoom = async (
  roomId: string
): Promise<{ message: string }> => {
  const response = await clientCommunityService.post<{ message: string }>(
    `/api/community/study-rooms/${roomId}/join`,
    {}
  );

  return response.data;
};

export const updateStudyRoom = async (
  roomId: string,
  data: UpdateStudyRoomInput
): Promise<StudyRoom> => {
  const payload = {
    ...data,
    tags: data.tags
      ?.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const response = await clientCommunityService.put<StudyRoom>(
    `/api/community/study-rooms/${roomId}`,
    payload
  );

  return response.data;
};

export const deleteStudyRoom = async (roomId: string): Promise<void> => {
  await clientCommunityService.deleteTyped(
    `/api/community/study-rooms/${roomId}`
  );
};

export const scheduleReminder = async (
  roomId: string
): Promise<{ message: string }> => {
  const response = await clientCommunityService.post<{ message: string }>(
    `/api/community/study-rooms/${roomId}/schedule-reminder`,
    {}
  );

  return response.data;
};

export const generateShareLink = async (
  data: GenerateShareLinkInput
): Promise<{ shareLink: string }> => {
  const response = await clientCommunityService.post<{ shareLink: string }>(
    `/api/community/study-rooms/${data.roomId}/share`,
    { expiresIn: data.expiresIn }
  );

  return response.data;
};
