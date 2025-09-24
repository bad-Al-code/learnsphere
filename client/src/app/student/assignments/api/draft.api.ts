import { communityService, courseService } from '@/lib/api/client';
import {
  CreateDiscussionInput,
  CreateDraftInput,
  Discussion,
  Draft,
} from '../schemas/draft.schema';

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

export const createDraft = (data: CreateDraftInput): Promise<Draft> => {
  return courseService.postTyped<Draft>('/api/assignments/drafts', data);
};

export const deleteDraft = (draftId: string): Promise<void> => {
  return courseService.deleteTyped<void>(`/api/assignments/drafts/${draftId}`);
};

export const createDiscussion = (
  data: CreateDiscussionInput
): Promise<Discussion> => {
  const payload = {
    ...data,
    tags: data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };

  return communityService.postTyped<Discussion>(
    '/api/community/discussions',
    payload
  );
};
