'use server';

import { revalidatePath } from 'next/cache';
import {
  createDeck,
  deleteDeck,
  generateCards,
  getDecks,
  getStudySession,
  recordProgress,
} from '../api/ai.api';
import {
  CreateDeckInput,
  GenerateCardsInput,
  RecordProgressInput,
} from '../schemas/flashcard.schema';

export const getDecksAction = async (courseId: string) => {
  try {
    return { data: await getDecks(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch your decks.' };
  }
};

export const createDeckAction = async (data: CreateDeckInput) => {
  try {
    const newDeck = await createDeck(data);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: newDeck };
  } catch (error) {
    return { error: 'Failed to create new deck.' };
  }
};

export const deleteDeckAction = async (deckId: string) => {
  try {
    await deleteDeck(deckId);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to delete deck.' };
  }
};

export const generateCardsAction = async (data: GenerateCardsInput) => {
  try {
    const updatedDeck = await generateCards(data);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: updatedDeck };
  } catch (error) {
    return { error: 'Failed to generate flashcards.' };
  }
};

export const getStudySessionAction = async (deckId: string) => {
  try {
    return { data: await getStudySession(deckId) };
  } catch (error) {
    return { error: 'Failed to load study session.' };
  }
};

export const recordProgressAction = async (data: RecordProgressInput) => {
  try {
    return { data: await recordProgress(data) };
  } catch (error) {
    return { error: 'Failed to save progress.' };
  }
};
