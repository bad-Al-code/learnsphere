import { Router } from 'express';

import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import { IntegrationController } from './integration.controller';
import { integrationIdParamSchema } from './integration.schema';

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/users/integrations:
 *   get:
 *     summary: Get all of the current user's connected integrations
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of the user's integration objects (without sensitive tokens).
 */
router.get('/', IntegrationController.getIntegrations);

/**
 * @openapi
 * /api/users/integrations/{id}:
 *   delete:
 *     summary: Disconnect an integration
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: The ID of the integration to delete.
 *     responses:
 *       '204':
 *         description: Integration disconnected successfully.
 */
router.delete(
  '/:id',
  validateRequest(integrationIdParamSchema),
  IntegrationController.deleteIntegration
);

export { router as integrationRouter };
