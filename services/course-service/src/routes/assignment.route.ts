import { Router } from 'express';
import { z } from 'zod';
import { AssignmentController } from '../controllers/assignment.controller';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { assignmentSchema, updateAssignmentSchema } from '../schemas';

const router = Router();
router.use(requireAuth, requireRole(['instructor', 'admin']));

/**
 * @openapi
 * /api/modules/{moduleId}/assignments:
 *   post:
 *     summary: Create a new assignment for a module
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         description: The ID of the module to add the assignment to
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Assignment object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentCreate'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Module not found
 */
router.post(
  '/modules/:moduleId/assignments',
  validateRequest(z.object({ body: assignmentSchema })),
  AssignmentController.create
);

/**
 * @openapi
 * /api/assignments/{assignmentId}:
 *   put:
 *     summary: Update an assignment
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         description: The ID of the assignment to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Assignment object with updated data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentUpdate'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Assignment not found
 */
router.put(
  '/assignments/:assignmentId',
  validateRequest(z.object({ body: updateAssignmentSchema })),
  AssignmentController.update
);

/**
 * @openapi
 * /api/assignments/{assignmentId}:
 *   delete:
 *     summary: Delete an assignment
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         description: The ID of the assignment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Assignment not found
 */
router.delete('/assignments/:assignmentId', AssignmentController.delete);

/**
 * @openapi
 * /api/assignments/reorder:
 *   post:
 *     summary: Reorder assignments within a module
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing moduleId and array of assignment order updates
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - items
 *             properties:
 *               moduleId:
 *                 type: string
 *                 description: The ID of the module containing the assignments
 *               items:
 *                 type: array
 *                 description: Array of assignment order updates
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Assignment ID
 *                     order:
 *                       type: integer
 *                       description: New order value
 *     responses:
 *       200:
 *         description: Assignments reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignments reordered successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Module not found
 */
router.post('/assignments/reorder', AssignmentController.reorder);

export { router as assignmentRouter };
