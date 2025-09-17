import { Router } from 'express';

import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares/validate-request';
import { WritingController } from './writing.controller';
import {
  assignmentIdParamSchema,
  createAssignmentSchema,
  getAssignmentsQuerySchema,
  updateAssignmentSchema,
} from './writing.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/ai/writing/assignments:
 *   get:
 *     summary: Get all writing assignments for a course
 *     tags: [AI Writing Assistant]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: An array of the user's writing assignments for the course.
 */
router.get(
  '/',
  validateRequest(getAssignmentsQuerySchema),
  WritingController.getAssignments
);

/**
 * @openapi
 * /api/ai/writing/assignments:
 *   post:
 *     summary: Create a new writing assignment document
 *     tags: [AI Writing Assistant]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 example: "Essay on Microservice Communication"
 *               prompt:
 *                 type: string
 *                 description: "The initial user prompt or assignment instructions."
 *     responses:
 *       '201':
 *         description: The newly created writing assignment object.
 */
router.post(
  '/',
  validateRequest(createAssignmentSchema),
  WritingController.createAssignment
);

/**
 * @openapi
 * /api/ai/writing/assignments/{id}:
 *   put:
 *     summary: Update a writing assignment
 *     tags: [AI Writing Assistant]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               prompt: { type: string }
 *     responses:
 *       '200':
 *         description: The updated assignment object.
 */
router.put(
  '/:id',
  validateRequest(assignmentIdParamSchema.merge(updateAssignmentSchema)),
  WritingController.updateAssignment
);

/**
 * @openapi
 * /api/ai/writing/assignments/{id}:
 *   delete:
 *     summary: Delete a writing assignment
 *     tags: [AI Writing Assistant]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '204':
 *         description: Assignment deleted successfully.
 */
router.delete(
  '/:id',
  validateRequest(assignmentIdParamSchema),
  WritingController.deleteAssignment
);

export { router as writingRouter };
