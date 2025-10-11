'use server';

import { revalidatePath } from 'next/cache';

import * as api from '../api/draft.api';
import {
  AddCollaboratorInput,
  CreateDiscussionInput,
  CreateDraftInput,
  PostReplyInput,
  UpdateDraftContentInput,
} from '../schemas/draft.schema';

const revalidate = () => revalidatePath('/student/assignments');

export const getMyDraftsAction = async (courseId: string) => {
  try {
    return { data: await api.getMyDrafts(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch drafts.' };
  }
};

export const createDraftAction = async (data: CreateDraftInput) => {
  try {
    const res = await api.createDraft(data);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to create draft.' };
  }
};

export const updateDraftAction = async (
  draftId: string,
  data: UpdateDraftContentInput
) => {
  try {
    const res = await api.updateDraft(draftId, data);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to save changes.' };
  }
};

export const deleteDraftAction = async (draftId: string) => {
  try {
    await api.deleteDraft(draftId);
    revalidate();
    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to delete draft.' };
  }
};

export const generateAISuggestionsAction = async (draftId: string) => {
  try {
    return { data: await api.generateAISuggestions(draftId) };
  } catch (error) {
    return { error: 'Failed to get AI suggestions.' };
  }
};

export const addCollaboratorAction = async (
  draftId: string,
  data: AddCollaboratorInput
) => {
  try {
    return { data: await api.addCollaborator(draftId, data) };
  } catch (error) {
    return { error: 'Failed to add collaborator.' };
  }
};

export const generateShareLinkAction = async (draftId: string) => {
  try {
    return { data: await api.generateShareLink(draftId) };
  } catch (error) {
    return { error: 'Failed to create share link.' };
  }
};

export const getDiscussionsByCourseAction = async (courseId: string) => {
  try {
    return { data: await api.getDiscussionsByCourse(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch discussions.' };
  }
};

export const createDiscussionAction = async (data: CreateDiscussionInput) => {
  try {
    const res = await api.createDiscussion(data);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to create discussion.' };
  }
};

export const postReplyAction = async (
  discussionId: string,
  data: PostReplyInput
) => {
  try {
    const res = await api.postReplyToDiscussion(discussionId, data);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to post reply.' };
  }
};

export const bookmarkDiscussionAction = async (discussionId: string) => {
  try {
    const res = await api.bookmarkDiscussion(discussionId);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to update bookmark.' };
  }
};

export const resolveDiscussionAction = async (discussionId: string) => {
  try {
    const res = await api.resolveDiscussion(discussionId);
    revalidate();
    return { data: res };
  } catch (error) {
    return { error: 'Failed to update status.' };
  }
};
