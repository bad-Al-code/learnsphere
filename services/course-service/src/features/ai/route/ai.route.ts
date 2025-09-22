import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { AIFeedbackController } from '../controllers/ai.controller';

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
router.get('/my-feedback', AIFeedbackController.getMyFeedback);

export { router as aiRouter };
