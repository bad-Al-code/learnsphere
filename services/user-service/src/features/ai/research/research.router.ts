import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { ResearchController } from './research.controller';
import { getBoardQuerySchema, performResearchSchema } from './research.schema';

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

export { router as researchRouter };
