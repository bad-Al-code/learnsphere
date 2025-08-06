/**
 * @openapi
 * tags:
 *   - name: Analytics
 *     description: Endpoints for retrieving statistical data for instructors and admins.
 */

import { Router } from 'express';

import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';

const router = Router();

/**
 * @openapi
 * /api/analytics/instructor:
 *   get:
 *     summary: "[Instructor/Admin] Get statistics for the current instructor"
 *     tags: [Analytics]
 *     description: |
 *       Retrieves key performance indicators for the authenticated instructor.
 *       The statistics include the total number of students enrolled across all their courses
 *       and the total revenue generated (placeholder).
 *       This endpoint requires the user to be authenticated and have a role of 'instructor' or 'admin'.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved instructor statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                   description: The total number of unique students across all courses.
 *                   example: 150
 *                 totalRevenue:
 *                   type: number
 *                   description: The total revenue generated (currently a placeholder).
 *                   example: 0
 *       '401':
 *         description: Not authorized due to missing or invalid authentication token.
 *       '403':
 *         description: Forbidden. The user does not have the required role ('instructor' or 'admin').
 */
router.get(
  '/instructor',
  requireAuth,
  requireRole(['instructor', 'admin']),
  AnalyticsController.getInstructorStats
);

export { router as analyticsRouter };
