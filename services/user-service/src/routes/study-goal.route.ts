import { Router } from 'express';

import { StudyGoalController } from '../controllers/study-goal.controller';
import { validateRequest } from '../middlewares';
import {
  requireAuth,
  requireAuthOrInternal,
} from '../middlewares/require-auth';
import {
  createStudyGoalSchema,
  goalIdParamsSchema,
  studyGoalQuerySchema,
  updateStudyGoalSchema,
} from '../schemas';

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

/**
 * @openapi
 * /api/users/me/study-goals:
 *   post:
 *     summary: "[Student] Create a new study goal"
 *     tags: [Study Goals]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudyGoalPayload'
 *     responses:
 *       '201':
 *         description: Successfully created the new study goal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudyGoal'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '401':
 *         description: Unauthorized.
 *       '409':
 *         description: Conflict - An active goal of this type already exists.
 */
router.post(
  '/me/study-goals',
  requireAuth,
  validateRequest(createStudyGoalSchema),
  StudyGoalController.create
);

/**
 * @openapi
 * /api/users/me/study-goals/{goalId}:
 *   put:
 *     summary: "[Student] Update a study goal"
 *     tags: [Study Goals]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudyGoalPayload'
 *     responses:
 *       '200':
 *         description: Successfully updated the goal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudyGoal'
 *       '403':
 *         description: Forbidden - User does not own this goal.
 *       '404':
 *         description: Not Found - Goal not found.
 */
router.put(
  '/me/study-goals/:goalId',
  requireAuth,
  validateRequest(goalIdParamsSchema.merge(updateStudyGoalSchema)),
  StudyGoalController.update
);

/**
 * @openapi
 * /api/users/me/study-goals/{goalId}:
 *   delete:
 *     summary: "[Student] Delete a study goal"
 *     tags: [Study Goals]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Successfully deleted the goal.
 *       '403':
 *         description: Forbidden - User does not own this goal.
 */
router.delete(
  '/me/study-goals/:goalId',
  requireAuth,
  validateRequest(goalIdParamsSchema),
  StudyGoalController.delete
);

export { router as studyGoalRouter };
