import { Router } from 'express';
import { CategoryController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { categorySchema } from '../schemas';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Endpoints for managing course categories
 */

/**
 * @openapi
 * /categories/slug/{slug}:
 *   get:
 *     summary: Get a category by slug
 *     tags: [Categories]]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal server error
 */
router.get('/slug/:slug', CategoryController.getBySlug);

/**
 * @openapi
 * /categories/list:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of all categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       '401':
 *         description: Unauthorized. Missing or invalid session token.
 */
router.get('/list', requireAuth, CategoryController.getAll);

router.use(requireAuth, requireRole(['admin']));

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPayload'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', validateRequest(categorySchema), CategoryController.create);

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', CategoryController.getAll);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPayload'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.put('/:id', validateRequest(categorySchema), CategoryController.update);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.delete('/:id', CategoryController.delete);

export { router as categoryRouter };
