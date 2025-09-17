import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     PublicIntegration:
 *       type: object
 *       required:
 *         - id
 *         - provider
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the integration.
 *         provider:
 *           type: string
 *           description: The provider name of the integration (e.g., "slack", "github").
 *         status:
 *           type: string
 *           description: Current status of the integration.
 *         scopes:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: The scopes granted to the integration, or null if not applicable.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the integration was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the integration was last updated.
 */
export const publicIntegrationSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  status: z.string(),
  scopes: z.array(z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PublicIntegration = z.infer<typeof publicIntegrationSchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     IntegrationIdParam:
 *       type: object
 *       required:
 *         - params
 *       properties:
 *         params:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: A valid integration ID is required.
 */
export const integrationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid integration ID is required.'),
  }),
});
