import { Router } from 'express';

import { AnalyticsController } from '../controllers';
import { requireAuth, requireRole } from '../middlewares';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/users/analytics/waitlist:
 *   get:
 *     summary: "[Admin] Get analytics for the user waitlist"
 *     tags:
 *       - Analytics
 *     description: Retrieves comprehensive analytics for the waitlist, including total sign-ups, daily trends, top referrers, and interest/role distributions. Requires admin privileges.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved waitlist analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/WaitlistAnalyticsResponse'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. User is not an admin.
 *       '500':
 *         description: Internal Server Error.
 */
router.get(
  '/waitlist',
  requireRole(['admin']),
  AnalyticsController.getWaitlistAnalytics
);

export { router as analyticsRouter };
