import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { NoteController } from './note.controller';
import {
  analyzeNoteSchema,
  createNoteSchema,
  getNotesQuerySchema,
  noteIdParamSchema,
  updateNoteSchema,
} from './note.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/users/ai/notes:
 *   get:
 *     summary: Get all notes for the current user in a specific course
 *     tags: [AI Smart Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the course to fetch notes for.
 *     responses:
 *       '200':
 *         description: An array of the user's notes for the specified course.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserNote'
 */
router.get('/', validateRequest(getNotesQuerySchema), NoteController.getNotes);

/**
 * @openapi
 * /api/users/ai/notes:
 *   post:
 *     summary: Create a new note for the current user
 *     tags: [AI Smart Notes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotePayload'
 *     responses:
 *       '201':
 *         description: The newly created note object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNote'
 */
router.post('/', validateRequest(createNoteSchema), NoteController.createNote);

/**
 * @openapi
 * /api/users/ai/notes/{id}:
 *   put:
 *     summary: Update a user's note (title or content)
 *     tags: [AI Smart Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotePayload'
 *     responses:
 *       '200':
 *         description: The updated note object.
 */
router.put(
  '/:id',
  validateRequest(noteIdParamSchema.merge(updateNoteSchema)),
  NoteController.updateNote
);

/**
 * @openapi
 * /api/users/ai/notes/{id}:
 *   delete:
 *     summary: Delete a user's note
 *     tags: [AI Smart Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '204':
 *         description: Note deleted successfully.
 */
router.delete(
  '/:id',
  validateRequest(noteIdParamSchema),
  NoteController.deleteNote
);

/**
 * @openapi
 * /api/users/ai/notes/{id}/analyze:
 *   post:
 *     summary: Analyze a note to generate AI insights
 *     tags: [AI Smart Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: The note object, now including the generated insights.
 */
router.post(
  '/:id/analyze',
  validateRequest(analyzeNoteSchema),
  NoteController.handleAnalyzeNote
);

export { router as noteRouter };
