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

/**
 * @openapi
 * /api/users/integrations/notion/connect:
 *   get:
 *     summary: Initiate connection to Notion
 *     description: Generates a Notion authorization URL and returns it to the client to start the OAuth2 flow.
 *     tags: [Integrations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successfully generated the authorization URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirectUrl:
 *                   type: string
 *                   format: uri
 *                   description: The URL to redirect the user to for Notion authorization.
 *       '401':
 *         description: Not authorized. User is not logged in.
 */
router.get('/notion/connect', IntegrationController.connectNotion);

/**
 * @openapi
 * /api/users/integrations/notion/callback:
 *   get:
 *     summary: Handle Notion OAuth callback
 *     description: This endpoint is the redirect URI for the Notion OAuth2 flow. It handles the authorization code and state to create an integration.
 *     tags: [Integrations]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The authorization code provided by Notion.
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *         description: The state parameter originally sent to Notion for verification.
 *     responses:
 *       '302':
 *         description: Redirects the user back to the client application's integration page with a status query parameter (e.g., ?status=success or ?status=error).
 */
router.get('/notion/callback', IntegrationController.handleNotionCallback);

/**
 * @openapi
 * /api/users/integrations/notion/export-course:
 *   post:
 *     summary: Export a full course summary to Notion
 *     description: Gathers all course data, user notes, and research findings, and compiles them into a new page in the user's Notion workspace.
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
 *                 description: The UUID of the course to export.
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
 *                   description: The URL of the newly created Notion page.
 *       '401':
 *         description: Not authorized. User is not logged in.
 *       '403':
 *         description: Forbidden. Notion integration not found or is invalid.
 */
router.post(
  '/notion/export-course',
  validateRequest(exportToNotionSchema),
  IntegrationController.exportCourseToNotion
);

export { router as integrationRouter };
