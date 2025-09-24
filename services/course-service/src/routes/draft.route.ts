import { Router } from 'express';

import { DraftController } from '../controllers/draft.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  createDraftSchema,
  draftIdParamSchema,
  updateDraftSchema,
} from '../schemas';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/assignments/drafts/my-drafts:
 *   get:
 *     summary: Retrieve all drafts of the authenticated user
 *     tags:
 *       - Assignment Drafts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CreateDraft'
 *       '401':
 *         description: Unauthorized
 */
router.get('/my-drafts', DraftController.getMyDrafts);

/**
 * @openapi
 * /api/assignments/drafts:
 *   post:
 *     summary: Create a new draft
 *     tags:
 *       - Assignment Drafts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDraft'
 *     responses:
 *       '201':
 *         description: Draft created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateDraft'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 */
router.post('/', validateRequest(createDraftSchema), DraftController.create);

/**
 * @openapi
 * /api/assignments/drafts/{id}:
 *   put:
 *     summary: Update an existing draft
 *     tags:
 *       - Assignment Drafts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the draft to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDraft'
 *     responses:
 *       '200':
 *         description: Draft updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateDraft'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Draft not found
 */
router.put('/:id', validateRequest(updateDraftSchema), DraftController.update);

/**
 * @openapi
 * /api/assignments/drafts/{id}:
 *   delete:
 *     summary: Delete a draft
 *     tags:
 *       - Assignment Drafts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the draft to delete
 *     responses:
 *       '204':
 *         description: Draft deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Draft not found
 */
router.delete(
  '/:id',
  validateRequest(draftIdParamSchema),
  DraftController.delete
);

export { router as draftRouter };
