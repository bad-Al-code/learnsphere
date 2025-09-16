import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { NoteController } from './note.controller';
import { createNoteSchema, getNotesQuerySchema } from './note.schema';

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

export { router as noteRouter };
