import { communityService, courseService } from '@/lib/api/client';
import {
  AddCollaboratorInput,
  AISuggestionResponse,
  CreateDiscussionInput,
  CreateDraftInput,
  Discussion,
  Draft,
  PostReplyInput,
  UpdateDraftContentInput,
} from '../schemas/draft.schema';

// --- DRAFTS ---
export const getMyDrafts = (): Promise<Draft[]> =>
  courseService.getTyped<Draft[]>('/api/assignments/drafts/my-drafts');
export const createDraft = (data: CreateDraftInput): Promise<Draft> =>
  courseService.postTyped<Draft>('/api/assignments/drafts', data);
export const updateDraft = (
  draftId: string,
  data: UpdateDraftContentInput
): Promise<Draft> =>
  courseService.putTyped<Draft>(`/api/assignments/drafts/${draftId}`, data);
export const deleteDraft = (draftId: string): Promise<void> =>
  courseService.deleteTyped<void>(`/api/assignments/drafts/${draftId}`);

export const generateAISuggestions = (
  draftId: string
): Promise<AISuggestionResponse> =>
  courseService.postTyped<AISuggestionResponse>(
    `/api/assignments/drafts/${draftId}/ai-suggestions`,
    {}
  );

export const addCollaborator = (
  draftId: string,
  data: AddCollaboratorInput
): Promise<{ message: string }> =>
  courseService.postTyped(
    `/api/assignments/drafts/${draftId}/collaborators`,
    data
  );

export const generateShareLink = (
  draftId: string
): Promise<{ shareToken: string }> =>
  courseService.postTyped(`/api/assignments/drafts/${draftId}/share`, {});

export const getDiscussionsByCourse = (
  courseId: string
): Promise<Discussion[]> =>
  communityService.getTyped<Discussion[]>(
    `/api/community/discussions/course/${courseId}`
  );

export const createDiscussion = (
  data: CreateDiscussionInput
): Promise<Discussion> =>
  communityService.postTyped<Discussion>('/api/community/discussions', data);

export const postReplyToDiscussion = (
  discussionId: string,
  data: PostReplyInput
): Promise<any> =>
  communityService.postTyped(
    `/api/community/discussions/${discussionId}/reply`,
    data
  );

export const bookmarkDiscussion = (
  discussionId: string
): Promise<{ message: string }> =>
  communityService.postTyped(
    `/api/community/discussions/${discussionId}/bookmark`,
    {}
  );

export const resolveDiscussion = (
  discussionId: string
): Promise<{ message: string }> =>
  communityService.postTyped(
    `/api/community/discussions/${discussionId}/resolve`,
    {}
  );
