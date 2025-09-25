'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  addCollaboratorAction,
  createDraftAction,
  deleteDraftAction,
  generateAISuggestionsAction,
  generateShareLinkAction,
  getMyDraftsAction,
  updateDraftAction,
} from '../actions/draft.action';
import {
  AddCollaboratorInput,
  CreateDraftInput,
  UpdateDraftContentInput,
} from '../schemas/draft.schema';

const DRAFTS_QUERY_KEY = ['assignment-drafts'];

export const useDrafts = () =>
  useQuery({
    queryKey: DRAFTS_QUERY_KEY,

    queryFn: async () => {
      const res = await getMyDraftsAction();
      if (res.error) throw new Error(res.error);

      return res.data;
    },
  });

export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDraftInput) => createDraftAction(data),

    onSuccess: (res) => {
      if (res.data) {
        toast.success('Draft created!');
        queryClient.invalidateQueries({ queryKey: DRAFTS_QUERY_KEY });
      } else {
        toast.error('Failed to create draft', { description: res.error });
      }
    },
  });
};

export const useUpdateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      draftId,
      data,
    }: {
      draftId: string;
      data: UpdateDraftContentInput;
    }) => updateDraftAction(draftId, data),
    onSuccess: (res) => {
      if (res.data) {
        queryClient.invalidateQueries({ queryKey: DRAFTS_QUERY_KEY });
      } else {
        toast.error('Failed to save changes', { description: res.error });
      }
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => deleteDraftAction(draftId),

    onSuccess: (res) => {
      if (res.data) {
        toast.success('Draft deleted.');
        queryClient.invalidateQueries({ queryKey: DRAFTS_QUERY_KEY });
      } else {
        toast.error('Failed to delete draft', { description: res.error });
      }
    },
  });
};

export const useGenerateAISuggestions = () =>
  useMutation({
    mutationFn: (draftId: string) => generateAISuggestionsAction(draftId),

    onSuccess: (res) => {
      if (res.error)
        toast.error('Failed to get AI suggestions.', {
          description: res.error,
        });
    },
  });

export const useAddCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      draftId,
      data,
    }: {
      draftId: string;
      data: AddCollaboratorInput;
    }) => addCollaboratorAction(draftId, data),

    onSuccess: (res) => {
      if (res.data) {
        toast.success('Collaborator added!');
        queryClient.invalidateQueries({ queryKey: DRAFTS_QUERY_KEY });
      } else {
        toast.error('Failed to add collaborator.', { description: res.error });
      }
    },
  });
};
export const useGenerateShareLink = () =>
  useMutation({
    mutationFn: (draftId: string) => generateShareLinkAction(draftId),
  });
