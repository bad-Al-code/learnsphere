import { communityService } from '@/lib/api/server';
import { Discussion } from '../schema';

export const getDiscussions = (courseId: string): Promise<Discussion[]> => {
  return communityService.getTyped<Discussion[]>(
    `/api/community/discussions/course/${courseId}`
  );
};
