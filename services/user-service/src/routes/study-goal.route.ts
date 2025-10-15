import { Router } from 'express';

import { StudyGoalController } from '../controllers/study-goal.controller';
import { validateRequest } from '../middlewares';
import {
  requireAuth,
  requireAuthOrInternal,
} from '../middlewares/require-auth';
import { studyGoalQuerySchema } from '../schemas/study-goal.schema';

const router = Router();

/**
 * @openapi
 * /api/users/internal/study-goal:
 *   get:
 *     summary: "[Internal] Get a specific study goal for a user"
 *     tags: [Study Goals]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: type
 *         required: true
 *         schema: { type: string, enum: [weekly_study_hours] }
 *     responses:
 *       '200':
 *         description: The user's study goal object.
 *       '404':
 *         description: No active goal of that type found for the user.
 */
router.get(
  '/internal/study-goal',
  requireAuthOrInternal,
  validateRequest(studyGoalQuerySchema),
  StudyGoalController.getInternalStudyGoal
);

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
