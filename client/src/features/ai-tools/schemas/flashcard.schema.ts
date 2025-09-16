import { z } from 'zod';

export const flashcardSchema = z.object({
  id: z.uuid(),
  deckId: z.uuid(),
  question: z.string(),
  answer: z.string(),
});

export const flashcardDeckSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  title: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  cards: z.array(flashcardSchema).optional(),
});

export const studyCardSchema = flashcardSchema.extend({
  progress: z
    .object({
      userId: z.uuid(),
      cardId: z.uuid(),
      deckId: z.uuid(),
      status: z.enum(['New', 'Learning', 'Mastered']),
      nextReviewAt: z.iso.datetime(),
      lastReviewedAt: z.iso.datetime().nullable(),
      correctStreaks: z.number().int(),
    })
    .nullable(),
});

export type FlashcardDeck = z.infer<typeof flashcardDeckSchema>;
export type Flashcard = z.infer<typeof flashcardSchema>;
export type StudyCard = z.infer<typeof studyCardSchema>;

export const createDeckInputSchema = z.object({
  courseId: z.uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters.').max(100),
});
export type CreateDeckInput = z.infer<typeof createDeckInputSchema>;

export const generateCardsInputSchema = z.object({
  deckId: z.uuid(),
  topic: z.string().min(3).max(100),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});
export type GenerateCardsInput = z.infer<typeof generateCardsInputSchema>;

export const recordProgressInputSchema = z.object({
  cardId: z.uuid(),
  deckId: z.uuid(),
  feedback: z.enum(['Hard', 'Good', 'Easy']),
});
export type RecordProgressInput = z.infer<typeof recordProgressInputSchema>;

export const studySessionResponseSchema = z.object({
  ai_flashcards: flashcardSchema,
  user_flashcard_progress: z
    .object({
      userId: z.string(),
      cardId: z.string(),
      deckId: z.string(),
      status: z.enum(['New', 'Learning', 'Mastered']),
      nextReviewAt: z.string(),
      lastReviewedAt: z.string().nullable(),
      correctStreaks: z.number().int(),
    })
    .nullable(),
});

export type StudySessionResponse = z.infer<typeof studySessionResponseSchema>;
