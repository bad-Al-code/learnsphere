import { Router } from 'express';

import { AnalyticsController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';

const router = Router();

/**
 * @openapi
 * /api/analytics/instructor/learning-analytics:
 *   get:
 *     summary: "[Instructor] Get learning analytics for the radar chart"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An object containing calculated learning metrics.
 */
router.get(
  '/instructor/learning-analytics',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getLearningAnalytics
);

/**
 * @openapi
 * /api/analytics/instructor/content-performance:
 *   get:
 *     summary: "[Instructor] Get performance analysis for different content types"
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of objects representing performance for each content type.
 */
router.get(
  '/instructor/content-performance',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getContentPerformance
);

export { router as analyticsRouter };
