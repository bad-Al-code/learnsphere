/**
 * @openapi
 * tags:
 *   - name: Modules
 *     description: Operations for managing course modules. Modules are children of Courses.
 */
import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createLessonSchema,
  createModuleSchema,
  reorderSchema,
} from '../schemas';
import { ModuleController } from '../controllers/module.controller';
import { LessonController } from '../controllers/lesson.controller';

const router = Router();

/**
 * @openapi
 * /api/modules/{moduleId}:
 *   get:
 *     summary: Get details of a single module, including its lessons
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: The module object with a nested array of its lessons.
 */
router.get('/:moduleId', ModuleController.getById);

/**
 * @openapi
 * /api/modules/{moduleId}:
 *   put:
 *     summary: Update a module's details (e.g., title)
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModulePayload'
 *     responses:
 *       '200':
 *         description: The updated module.
 */
router.put(
  '/:moduleId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(createModuleSchema),
  ModuleController.update
);

/**
 * @openapi
 * /api/modules/{moduleId}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *     responses:
 *       '200':
 *         description: Module deleted successfully.
 */
router.delete(
  '/:moduleId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  ModuleController.delete
);

/**
 * @openapi
 * /api/modules/{moduleId}/lessons:
 *   post:
 *     summary: Add a new lesson to a module
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLessonPayload'
 *     responses:
 *       '201':
 *         description: The newly created lesson.
 */
router.post(
  '/:moduleId/lessons',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(createLessonSchema),
  LessonController.create
);

/**
 * @openapi
 * /api/modules/reorder:
 *   post:
 *     summary: Reorder a list of modules within a course
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderPayload'
 *     responses:
 *       '200':
 *         description: Modules reordered successfully.
 */
router.post(
  '/reorder',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(reorderSchema),
  ModuleController.reorder
);

export { router as moduleRouter };
