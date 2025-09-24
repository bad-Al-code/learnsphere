import { communityService, courseService } from '@/lib/api/client';
import { Discussion, Draft } from '../schemas/draft.schema';

export const getMyDrafts = async (): Promise<Draft[]> => {
  const res = await courseService.get<Draft[]>(
    '/api/assignments/drafts/my-drafts'
  );

  return res.data;
};

export const getDiscussions = async (
  courseId: string
): Promise<Discussion[]> => {
  const res = await communityService.get<Discussion[]>(
    `/api/community/discussions/course/${courseId}`
  );

  return res.data;
};
