import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDeckRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course the deck belongs to.
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Title of the deck.
 */
export const createDeckSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
    title: z.string().min(3, 'Title must be at least 3 characters.').max(100),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GetDecksQuery:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course to fetch decks for.
 */
export const getDecksQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('A valid courseId is required in the query.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     DeckIdParam:
 *       type: object
 *       required:
 *         - deckId
 *       properties:
 *         deckId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the deck.
 */
export const deckIdParamSchema = z.object({
  params: z.object({
    deckId: z.string().uuid('A valid deckId is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GenerateCardsRequest:
 *       type: object
 *       required:
 *         - topic
 *         - difficulty
 *       properties:
 *         topic:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: The topic for generating flashcards.
 *         difficulty:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *           description: Difficulty level of the generated flashcards.
 */
export const generateCardsSchema = z.object({
  body: z.object({
    topic: z.string().min(3, 'Topic must be at least 3 characters.').max(100),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     FlashcardResponse:
 *       type: object
 *       required:
 *         - flashcards
 *       properties:
 *         flashcards:
 *           type: array
 *           description: List of generated flashcards.
 *           items:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 description: The flashcard question.
 *               answer:
 *                 type: string
 *                 description: The flashcard answer.
 */
export const flashcardResponseSchemaZod = z.object({
  flashcards: z.array(
    z.object({
      question: z.string().min(5, 'Flashcard question must be meaningful.'),
      answer: z.string().min(1, 'Flashcard must have an answer.'),
    })
  ),
});

export type GeneratedCard = z.infer<
  typeof flashcardResponseSchemaZod
>['flashcards'][number];

/**
 * @openapi
 * components:
 *   schemas:
 *     RecordProgressRequest:
 *       type: object
 *       required:
 *         - cardId
 *         - deckId
 *         - feedback
 *       properties:
 *         cardId:
 *           type: string
 *           format: uuid
 *           description: ID of the flashcard to record feedback for.
 *         deckId:
 *           type: string
 *           format: uuid
 *           description: ID of the deck the card belongs to.
 *         feedback:
 *           type: string
 *           enum: [Hard, Good, Easy]
 *           description: User feedback for spaced repetition.
 */
export const recordProgressSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    deckId: z.string().uuid(),
    feedback: z.enum(['Hard', 'Good', 'Easy']),
  }),
});
