/**
 * @openapi
 * tags:
 *   - name: Modules
 *     description: Operations for managing course modules. Modules are children of Courses.
 */
import { Router } from 'express';

import { LessonController, ModuleController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createLessonSchema,
  createModuleSchema,
  reorderSchema,
} from '../schemas';

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

/**
 * @openapi
 * /modules/bulk:
 *   post:
 *     tags:
 *       - Modules
 *     summary: Retrieve multiple modules by their IDs
 *     description: Fetches a list of modules with their basic information (ID and title) based on an array of provided module IDs.
 *     operationId: getBulkModules
 *     requestBody:
 *       description: An object containing an array of module IDs to retrieve.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleIds
 *             properties:
 *               moduleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: An array of module UUIDs to fetch.
 *                 example:
 *                   - "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                   - "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
 *     responses:
 *       '200':
 *         description: OK. Successfully retrieved the modules. The response is an array of module objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the module.
 *                     example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                   title:
 *                     type: string
 *                     description: The title of the module.
 *                     example: "Introduction to JavaScript"
 *       '400':
 *         description: Bad Request. The request body is missing or `moduleIds` is not a valid array.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input: moduleIds must be an array of strings."
 *       '500':
 *         description: Internal Server Error. An error occurred on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.post('/bulk', ModuleController.getBulk);

export { router as moduleRouter };
