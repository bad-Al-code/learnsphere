import { Router } from 'express';

import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import { AIController } from './ai.controller';
import { draftSuggestionsParamsSchema } from './ai.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/ai/my-feedback:
 *   get:
 *     summary: Retrieve feedback for the authenticated user
 *     tags:
 *       - AI Feedback
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of feedback items for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The feedback ID
 *                   studentId:
 *                     type: string
 *                     description: ID of the student
 *                   content:
 *                     type: string
 *                     description: Feedback content
 *                   reviewedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the feedback was reviewed
 *       401:
 *         description: Unauthorized - user not authenticated
 */
router.get('/my-feedback', AIController.getMyFeedback);

/**
 * @openapi
 * /api/ai/{submissionId}/recheck:
 *   post:
 *     summary: Request AI feedback recheck for a specific submission
 *     tags:
 *       - AI Feedback
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the assignment submission to recheck
 *     responses:
 *       201:
 *         description: Feedback generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 submissionId:
 *                   type: string
 *                   format: uuid
 *                 score:
 *                   type: number
 *                 summary:
 *                   type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 detailed_feedback:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [reviewed, pending]
 *                 reviewed_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid submissionId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:submissionId/recheck', AIController.requestRecheck);

/**
 * @openapi
 * /api/ai/{id}/suggestions:
 *   post:
 *     summary: Generate AI draft suggestions
 *     description: Returns AI-generated suggestions (content, structure, grammar, research, etc.) for a given draft.
 *     tags:
 *       - AI Feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the draft to generate suggestions for.
 *     responses:
 *       200:
 *         description: Successfully generated draft suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The category of suggestion (e.g., content, structure, grammar, research).
 *                       suggestion:
 *                         type: string
 *                         description: The AI-generated suggestion text.
 *                       confidence:
 *                         type: integer
 *                         description: Confidence score for this suggestion.
 *                         example: 85
 *       400:
 *         description: Invalid request parameters (e.g., invalid UUID).
 *       401:
 *         description: Not authorized — user is not logged in.
 *       404:
 *         description: Draft not found or does not belong to the current user.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/:id/suggestions',
  validateRequest(draftSuggestionsParamsSchema),
  AIController.getDraftSuggestions
);

export { router as aiRouter };
