import { Router } from 'express';

import { StudyGoalController } from '../controllers/study-goal.controller';
import { requireAuth } from '../middlewares/require-auth';

const router = Router();

/**
 * @openapi
 * /api/users/me/study-goals:
 *   get:
 *     summary: Get all study goals for the current user
 *     tags: [My Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of the user's study goals.
 */
router.get('/me/study-goals', requireAuth, StudyGoalController.getMyGoals);

export { router as studyGoalRouter };
