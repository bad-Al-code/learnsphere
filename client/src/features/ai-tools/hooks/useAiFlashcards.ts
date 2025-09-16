'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDeckAction,
  deleteDeckAction,
  generateCardsAction,
  getDecksAction,
  getStudySessionAction,
  recordProgressAction,
} from '../actions/flaschcards';

export const useGetDecks = (courseId: string) => {
  return useQuery({
    queryKey: ['flashcard-decks', courseId],

    queryFn: async () => {
      const result = await getDecksAction(courseId);
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    enabled: !!courseId,
  });
};

export const useCreateDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeckAction,

    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['flashcard-decks', variables.courseId],
        });
      }
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeckAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-decks'] });
    },
  });
};

export const useGenerateCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateCardsAction,

    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: ['flashcard-decks', result.data.courseId],
        });
      }
    },
  });
};

export const useGetStudySession = (deckId: string | null) => {
  return useQuery({
    queryKey: ['study-session', deckId],
    queryFn: async () => {
      if (!deckId) return null;
      const result = await getStudySessionAction(deckId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!deckId,
  });
};

export const useRecordProgress = () => {
  return useMutation({
    mutationFn: recordProgressAction,
  });
};
