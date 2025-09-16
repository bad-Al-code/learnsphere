import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { FlashcardController } from './flashcard.controller';
import { createDeckSchema, getDecksQuerySchema } from './flashcard.schema';

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

export { router as flashcardRouter };
