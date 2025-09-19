import { Router } from 'express';

import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import { IntegrationController } from './integration.controller';
import {
  exportToNotionSchema,
  integrationIdParamSchema,
} from './integration.schema';

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
 *         schema:
 *           type: string
 *           format: uuid
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

/**
 * @openapi
 * /api/users/integrations/google-calendar/connect:
 *   get:
 *     summary: Get a redirect URL to start the Google Calendar OAuth flow
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The URL to redirect the user to for Google Calendar consent.
 */
router.get(
  '/google-calendar/connect',
  IntegrationController.connectGoogleCalendar
);

/**
 * @openapi
 * /api/users/integrations/google-drive/connect:
 *   get:
 *     summary: Get a redirect URL to start the Google Drive OAuth flow
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The URL to redirect the user to for Google Drive consent.
 */
router.get('/google-drive/connect', IntegrationController.connectGoogleDrive);

/**
 * @openapi
 * /api/users/integrations/gmail/connect:
 *   get:
 *     summary: Get a redirect URL to start the Gmail OAuth flow
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: The URL to redirect the user to for Gmail consent.
 */
router.get('/gmail/connect', IntegrationController.connectGmail);

/**
 * @openapi
 * /api/users/integrations/google/callback:
 *   get:
 *     summary: OAuth callback endpoint for Google
 *     tags: [Integrations]
 *     description: Google redirects here after user consent. This should not be called directly.
 *     responses:
 *       '302':
 *         description: Redirects the user back to the frontend integrations page.
 */
router.get('/google/callback', IntegrationController.handleGoogleCallback);

router.get('/notion/connect', IntegrationController.connectNotion);
router.get('/notion/callback', IntegrationController.handleNotionCallback);

/**
 * @openapi
 * /api/users/integrations/notion/export-course:
 *   post:
 *     summary: Export a full course summary to Notion
 *     tags: [Integrations]
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
 *     responses:
 *       '200':
 *         description: Successfully created the page in Notion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pageUrl:
 *                   type: string
 *                   format: uri
 */
router.post(
  '/notion/export-course',
  validateRequest(exportToNotionSchema),
  IntegrationController.exportCourseToNotion
);

export { router as integrationRouter };
