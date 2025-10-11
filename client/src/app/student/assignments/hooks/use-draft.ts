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

const DRAFTS_QUERY_KEY = (courseId: string) => ['assignment-drafts', courseId];

export const useDrafts = (courseId: string) =>
  useQuery({
    queryKey: DRAFTS_QUERY_KEY(courseId),
    queryFn: async () => {
      const res = await getMyDraftsAction(courseId);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    enabled: !!courseId,
  });

export const useCreateDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDraftInput) => {
      const res = await createDraftAction(data);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      toast.success('Draft created!');
      queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create draft', { description: error.message });
    },
  });
};

export const useUpdateDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      draftId,
      data,
    }: {
      draftId: string;
      data: UpdateDraftContentInput;
    }) => {
      const res = await updateDraftAction(draftId, data);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to save changes', { description: error.message });
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draftId: string) => {
      const res = await deleteDraftAction(draftId);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      toast.success('Draft deleted.');
      queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete draft', { description: error.message });
    },
  });
};

export const useGenerateAISuggestions = () =>
  useMutation({
    mutationFn: async (draftId: string) => {
      const res = await generateAISuggestionsAction(draftId);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onError: (error: Error) => {
      toast.error('Failed to get AI suggestions.', {
        description: error.message,
      });
    },
  });

export const useAddCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      draftId,
      data,
    }: {
      draftId: string;
      data: AddCollaboratorInput;
    }) => {
      const res = await addCollaboratorAction(draftId, data);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      toast.success('Collaborator added!');
      queryClient.invalidateQueries({ queryKey: ['assignment-drafts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add collaborator.', {
        description: error.message,
      });
    },
  });
};

export const useGenerateShareLink = () =>
  useMutation({
    mutationFn: async (draftId: string) => {
      const res = await generateShareLinkAction(draftId);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onError: (error: Error) => {
      toast.error('Failed to create share link.', {
        description: error.message,
      });
    },
  });
