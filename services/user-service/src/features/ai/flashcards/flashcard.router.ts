import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { FlashcardController } from './flashcard.controller';
import {
  createDeckSchema,
  deckIdParamSchema,
  generateCardsSchema,
  getDecksQuerySchema,
  recordProgressSchema,
} from './flashcard.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/ai/flashcards/decks:
 *   post:
 *     summary: Create a new flashcard deck
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 example: "Chapter 1: Key Terms"
 *     responses:
 *       '201':
 *         description: The newly created deck object.
 */
router.post(
  '/decks',
  validateRequest(createDeckSchema),
  FlashcardController.createDeck
);

/**
 * @openapi
 * /api/ai/flashcards/decks:
 *   get:
 *     summary: Get all flashcard decks for a course
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the course to fetch decks for.
 *     responses:
 *       '200':
 *         description: An array of the user's flashcard decks for the course.
 */
router.get(
  '/decks',
  validateRequest(getDecksQuerySchema),
  FlashcardController.getDecks
);

/**
 * @openapi
 * /api/ai/flashcards/decks/{deckId}:
 *   delete:
 *     summary: Delete a flashcard deck
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '204':
 *         description: Deck deleted successfully.
 */
router.delete(
  '/decks/:deckId',
  validateRequest(deckIdParamSchema),
  FlashcardController.deleteDeck
);

/**
 * @openapi
 * /api/ai/flashcards/decks/{deckId}/generate-cards:
 *   post:
 *     summary: Generate new flashcards for a deck using AI
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *     responses:
 *       '200':
 *         description: The updated deck object, now including the newly generated cards.
 */
router.post(
  '/decks/:deckId/generate-cards',
  validateRequest(deckIdParamSchema.merge(generateCardsSchema)),
  FlashcardController.handleGenerateCards
);

/**
 * @openapi
 * /api/ai/flashcards/decks/{deckId}/study-session:
 *   get:
 *     summary: Get a curated list of flashcards for a study session
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An array of flashcard objects due for review.
 */
router.get(
  '/decks/:deckId/study-session',
  validateRequest(deckIdParamSchema),
  FlashcardController.getStudySession
);

/**
 * @openapi
 * /api/ai/flashcards/progress:
 *   post:
 *     summary: Record a user's feedback on a flashcard
 *     tags: [AI Flashcards]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardId:
 *                 type: string
 *                 format: uuid
 *               deckId:
 *                 type: string
 *                 format: uuid
 *               feedback:
 *                 type: string
 *                 enum: [Hard, Good, Easy]
 *     responses:
 *       '200':
 *         description: Progress was recorded successfully.
 */
router.post(
  '/progress',
  validateRequest(recordProgressSchema),
  FlashcardController.recordProgress
);

export { router as flashcardRouter };
