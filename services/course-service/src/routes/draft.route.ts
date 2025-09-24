import { Router } from 'express';

import { DraftController } from '../controllers/draft.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  addCollaboratorSchema,
  createDraftSchema,
  draftIdParamSchema,
  shareTokenParamsSchema,
  updateDraftSchema,
} from '../schemas';

const router = Router();

/**
 * @openapi
 * /api/community/shared/{token}:
 *   get:
 *     summary: Retrieve a shared draft by token
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for accessing the shared draft
 *     responses:
 *       200:
 *         description: Shared draft retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentDraft'
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: Shared draft not found
 */
router.get(
  '/shared/:token',
  validateRequest(shareTokenParamsSchema),
  DraftController.getShared
);

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

/**
 * @openapi
 * /api/assignments/{id}/collaborators:
 *   post:
 *     summary: Add a collaborator to a draft
 *     tags:
 *       - Drafts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the draft
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the collaborator to add
 *     responses:
 *       200:
 *         description: Collaborator added successfully
 *       400:
 *         description: Bad request (invalid email or trying to add self)
 *       404:
 *         description: User not found
 */
router.post(
  '/:id/collaborators',
  validateRequest(addCollaboratorSchema),
  DraftController.addCollaborator
);

/**
 * @openapi
 * /api/assignments/{id}/share:
 *   post:
 *     summary: Generate a shareable link for a draft
 *     tags:
 *       - Drafts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the draft
 *     responses:
 *       200:
 *         description: Share link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareLink:
 *                   type: string
 *                   format: uri
 *                   description: The generated shareable link
 *       403:
 *         description: Unauthorized or not owner of the draft
 */
router.post(
  '/:id/share',
  validateRequest(draftIdParamSchema),
  DraftController.share
);

export { router as draftRouter };
