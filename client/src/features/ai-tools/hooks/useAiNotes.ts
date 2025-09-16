'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  analyzeNoteAction,
  createNoteAction,
  deleteNoteAction,
  getNotesAction,
  updateNoteAction,
} from '../actions/notes';
import { UserNote } from '../schemas/notes.schema';

export const useGetNotes = (courseId: string) => {
  return useQuery({
    queryKey: ['ai-notes', courseId],

    queryFn: async () => {
      const result = await getNotesAction(courseId);
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    enabled: !!courseId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNoteAction,

    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['ai-notes', variables.courseId],
        });
      }
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNoteAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['ai-notes', result.data.courseId],
        });
      }
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNoteAction,

    onSuccess: (result, noteId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-notes'] });
    },
  });
};

export const useAnalyzeNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeNoteAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(
          ['ai-notes', result.data.courseId],
          (oldData: UserNote[] | undefined) =>
            oldData?.map((note) =>
              note.id === result.data!.id ? result.data! : note
            )
        );
      }
    },
  });
};
