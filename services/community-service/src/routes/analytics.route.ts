import { Router } from 'express';

import { AnalyticsController } from '../controllers';
import { requireAuth } from '../middlewares';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/community/insights:
 *   get:
 *     summary: Get community insights summary
 *     description: Returns a summary of community activity, including percentage of answered discussions, total active discussions, and total members.
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Community insights successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionsAnswered:
 *                   type: string
 *                   example: "75%"
 *                   description: Percentage of answered discussions
 *                 activeDiscussions:
 *                   type: integer
 *                   example: 120
 *                   description: Total number of active group discussions
 *                 communityMembers:
 *                   type: integer
 *                   example: 500
 *                   description: Total number of registered community members
 *       401:
 *         description: Unauthorized - authentication required
 */
router.get('/insights', AnalyticsController.getCommunityInsights);

export { router as analyticsRouter };
