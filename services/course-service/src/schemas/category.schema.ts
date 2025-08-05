import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryPayload:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               minLength: 3
 *               example: "Programming"
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "2c9d3c8f-5a9f-41c5-b8f9-9b9fc4d23142"
 *         name:
 *           type: string
 *           example: "Programming"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T14:21:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-05T14:21:00Z"
 */

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Category name must be at least 3 characters long'),
  }),
});
