import { createDiscussion, createDraft, deleteDraft } from '../api/draft.api';
import {
  CreateDiscussionInput,
  CreateDraftInput,
} from '../schemas/draft.schema';

export const createDraftAction = async (data: CreateDraftInput) => {
  try {
    return { data: await createDraft(data) };
  } catch (error) {
    return { error: 'Failed to create draft.' };
  }
};

export const deleteDraftAction = async (draftId: string) => {
  try {
    return { data: await deleteDraft(draftId) };
  } catch (error) {
    return { error: 'Failed to delete draft.' };
  }
};

export const createDiscussionAction = async (data: CreateDiscussionInput) => {
  try {
    return { data: await createDiscussion(data) };
  } catch (error) {
    return { error: 'Failed to create discussion.' };
  }
};
