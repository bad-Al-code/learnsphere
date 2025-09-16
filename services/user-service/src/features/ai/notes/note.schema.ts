import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetNotesQuery:
 *       type: object
 *       properties:
 *         query:
 *           type: object
 *           required:
 *             - courseId
 *           properties:
 *             courseId:
 *               type: string
 *               format: uuid
 *               description: A valid courseId is required.
 */
export const getNotesQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateNote:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - courseId
 *             - title
 *           properties:
 *             courseId:
 *               type: string
 *               format: uuid
 *               description: A valid courseId is required.
 *             title:
 *               type: string
 *               maxLength: 255
 *               description: Title of the note (1–255 characters).
 *             content:
 *               type: string
 *               nullable: true
 *               description: Optional content for the note.
 */
export const createNoteSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().optional(),
  }),
});
