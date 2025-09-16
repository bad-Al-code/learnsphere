import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { ResearchController } from './research.controller';
import {
  findingIdParamSchema,
  getBoardQuerySchema,
  performResearchSchema,
  saveFindingSchema,
  updateFindingNotesSchema,
} from './research.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/ai/research/query:
 *   post:
 *     summary: Perform an AI-powered research query
 *     tags: [AI Research]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerformResearchRequest'
 *     responses:
 *       '200':
 *         description: An array of research findings from the AI.
 */
router.post(
  '/query',
  validateRequest(performResearchSchema),
  ResearchController.handlePerformResearch
);

/**
 * @openapi
 * /api/ai/research/board:
 *   get:
 *     summary: Get the user's research board for a course
 *     tags: [AI Research]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: The user's research board, including any saved findings.
 */
router.get(
  '/board',
  validateRequest(getBoardQuerySchema),
  ResearchController.getBoard
);

/**
 * @openapi
 * /api/ai/research/board/findings:
 *   post:
 *     summary: Save a research finding to the user's board
 *     tags: [AI Research]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveFindingRequest'
 *     responses:
 *       '201':
 *         description: The finding was successfully saved.
 */
router.post(
  '/board/findings',
  validateRequest(saveFindingSchema),
  ResearchController.saveFinding
);

/**
 * @openapi
 * /api/ai/research/board/findings/{id}:
 *   put:
 *     summary: Update the user's personal notes on a saved finding
 *     tags: [AI Research]
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
 *             $ref: '#/components/schemas/UpdateFindingNotesRequest'
 *     responses:
 *       '200':
 *         description: Notes updated successfully.
 */
router.put(
  '/board/findings/:id',
  validateRequest(findingIdParamSchema.merge(updateFindingNotesSchema)),
  ResearchController.updateFindingNotes
);

/**
 * @openapi
 * /api/ai/research/board/findings/{id}:
 *   delete:
 *     summary: Delete a saved finding from the user's board
 *     tags: [AI Research]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '204':
 *         description: Finding deleted successfully.
 */
router.delete(
  '/board/findings/:id',
  validateRequest(findingIdParamSchema),
  ResearchController.deleteFinding
);

/**
 * @openapi
 * /api/ai/research/board/findings/{id}/summarize:
 *   post:
 *     summary: Trigger an AI summary for a saved finding
 *     tags: [AI Research]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: The finding object, now including the AI-generated summary.
 */
router.post(
  '/board/findings/:id/summarize',
  validateRequest(findingIdParamSchema),
  ResearchController.summarizeFinding
);

export { router as researchRouter };
