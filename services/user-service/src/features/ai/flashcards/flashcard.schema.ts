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
