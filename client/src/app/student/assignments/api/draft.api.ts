import { communityService, courseService } from '@/lib/api/server';
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

export const getMyDrafts = async (courseId: string): Promise<Draft[]> => {
  try {
    return await courseService.getTyped<Draft[]>(
      `/api/assignments/drafts/my-drafts?courseId=${courseId}`
    );
  } catch (error) {
    console.error('Error fetching drafts:', error);
    throw error;
  }
};

export const createDraft = async (data: CreateDraftInput): Promise<Draft> => {
  try {
    return await courseService.postTyped<Draft>(
      '/api/assignments/drafts',
      data
    );
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
};

export const updateDraft = async (
  draftId: string,
  data: UpdateDraftContentInput
): Promise<Draft> => {
  try {
    return await courseService.putTyped<Draft>(
      `/api/assignments/drafts/${draftId}`,
      data
    );
  } catch (error) {
    console.error('Error updating draft:', error);
    throw error;
  }
};

export const deleteDraft = async (draftId: string): Promise<void> => {
  try {
    await courseService.deleteTyped<void>(`/api/assignments/drafts/${draftId}`);
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
};

export const generateAISuggestions = async (
  draftId: string
): Promise<AISuggestionResponse> => {
  try {
    return await courseService.postTyped<AISuggestionResponse>(
      `/api/assignments/drafts/${draftId}/ai-suggestions`,
      {}
    );
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    throw error;
  }
};

export const addCollaborator = async (
  draftId: string,
  data: AddCollaboratorInput
): Promise<{ message: string }> => {
  try {
    return await courseService.postTyped<{ message: string }>(
      `/api/assignments/drafts/${draftId}/collaborators`,
      data
    );
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
};

export const generateShareLink = async (
  draftId: string
): Promise<{ shareToken: string }> => {
  try {
    return await courseService.postTyped<{ shareToken: string }>(
      `/api/assignments/drafts/${draftId}/share`,
      {}
    );
  } catch (error) {
    console.error('Error generating share link:', error);
    throw error;
  }
};

export const getDiscussionsByCourse = async (
  courseId: string
): Promise<Discussion[]> => {
  try {
    return await communityService.getTyped<Discussion[]>(
      `/api/community/discussions/course/${courseId}`
    );
  } catch (error) {
    console.error('Error fetching discussions:', error);
    throw error;
  }
};

export const createDiscussion = async (
  data: CreateDiscussionInput
): Promise<Discussion> => {
  try {
    return await communityService.postTyped<Discussion>(
      '/api/community/discussions',
      data
    );
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
};

export const postReplyToDiscussion = async (
  discussionId: string,
  data: PostReplyInput
): Promise<any> => {
  try {
    return await communityService.postTyped<any>(
      `/api/community/discussions/${discussionId}/reply`,
      data
    );
  } catch (error) {
    console.error('Error posting reply:', error);
    throw error;
  }
};

export const bookmarkDiscussion = async (
  discussionId: string
): Promise<{ message: string }> => {
  try {
    return await communityService.postTyped<{ message: string }>(
      `/api/community/discussions/${discussionId}/bookmark`,
      {}
    );
  } catch (error) {
    console.error('Error bookmarking discussion:', error);
    throw error;
  }
};

export const resolveDiscussion = async (
  discussionId: string
): Promise<{ message: string }> => {
  try {
    return await communityService.postTyped<{ message: string }>(
      `/api/community/discussions/${discussionId}/resolve`,
      {}
    );
  } catch (error) {
    console.error('Error resolving discussion:', error);
    throw error;
  }
};
