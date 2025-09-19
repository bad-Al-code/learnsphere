import { Client } from '@notionhq/client';
import axios from 'axios';
import { and, eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { NotionClient } from '../../clients/notion.client';
import { env } from '../../config/env';
import logger from '../../config/logger';
import { db } from '../../db';
import { userIntegrations } from '../../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../errors';
import { CryptoService } from '../../services/crypto.service';
import { NoteRepository } from '../ai/notes/note.repository';
import { ResearchRepository } from '../ai/research/research.repository';
import { IntegrationRepository } from './integration.repository';
import { PublicIntegration } from './integration.schema';

export class IntegrationService {
  /**
   * Retrieves all integrations for a user, returning only public-safe data.
   * @param userId The ID of the user.
   * @returns A list of public-safe integration objects.
   */
  public static async getIntegrationsForUser(
    userId: string
  ): Promise<PublicIntegration[]> {
    const integrations = await IntegrationRepository.findByUserId(userId);

    return integrations.map((integ) => ({
      id: integ.id,
      provider: integ.provider,
      status: integ.status,
      scopes: integ.scopes,
      createdAt: integ.createdAt,
      updatedAt: integ.updatedAt,
    }));
  }

  /**
   * Deletes an integration after verifying ownership.
   * @param integrationId The ID of the integration to delete.
   * @param userId The ID of the user requesting the deletion.
   */
  public static async deleteIntegration(
    integrationId: string,
    userId: string
  ): Promise<void> {
    const integration = await IntegrationRepository.findById(integrationId);

    if (!integration) {
      throw new NotFoundError('Integration');
    }
    if (integration.userId !== userId) {
      throw new ForbiddenError();
    }

    await IntegrationRepository.delete(integrationId);
  }

  /**
   * Creates and returns a configured Google OAuth2 client.
   * @private
   * @returns {OAuth2Client} A Google OAuth2 client instance initialized with client ID, secret, and callback URL.
   */
  private static getGoogleOAuth2Client(): OAuth2Client {
    return new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_CALLBACK_URL
    );
  }

  /**
   * Generates a Google OAuth 2.0 authorization URL with a state payload
   * containing the user ID and provider. Used internally by provider-specific
   * helpers.
   * @private
   * @param {string} userId - The unique ID of the user requesting Google authentication.
   * @param {string[]} scopes - List of OAuth scopes to request from Google.
   * @param {string} provider - The integration provider identifier (e.g., "google_calendar").
   * @returns {string} A URL that the user can visit to grant access to their Google account.
   */
  private static generateGoogleAuthUrl(
    userId: string,
    scopes: string[],
    provider: string
  ): string {
    const oauth2Client = this.getGoogleOAuth2Client();
    const state = Buffer.from(JSON.stringify({ userId, provider })).toString(
      'base64'
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
    });

    return url;
  }

  /**
   * Generates a Google OAuth 2.0 authorization URL for Google Calendar.
   * @param {string} userId - The unique ID of the user requesting authentication.
   * @returns {string} A Google Calendar OAuth consent URL.
   */
  public static generateGoogleCalendarAuthUrl(userId: string): string {
    return this.generateGoogleAuthUrl(
      userId,
      [env.GOOGLE_CALENDAR_SCOPES],
      'google_calendar'
    );
  }

  /**
   * Generates a Google OAuth 2.0 authorization URL for Google Drive.
   * @param {string} userId - The unique ID of the user requesting authentication.
   * @returns {string} A Google Drive OAuth consent URL.
   */
  public static generateGoogleDriveAuthUrl(userId: string): string {
    return this.generateGoogleAuthUrl(
      userId,
      [env.GOOGLE_DRIVE_SCOPES],
      'google_drive'
    );
  }

  /**
   * Generates a Google OAuth 2.0 authorization URL for Gmail.
   * @param {string} userId - The unique ID of the user requesting authentication.
   * @returns {string} A Gmail OAuth consent URL.
   */
  public static generateGmailAuthUrl(userId: string): string {
    return this.generateGoogleAuthUrl(
      userId,
      [env.GOOGLE_GMAIL_SCOPES],
      'gmail'
    );
  }

  /**
   * Handles the Google OAuth 2.0 callback by:
   *  - Exchanging the authorization code for tokens.
   *  - Validating the presence of an access token.
   *  - Encrypting and saving the tokens to the database via `IntegrationRepository`.
   *  - Updating refresh token only if a new one is provided by Google.
   * @param {string} code - The authorization code returned by Google after user consent.
   * @param {string} state - The OAuth state parameter, used here as the user ID.
   * @returns {Promise<void>} Resolves once the integration has been successfully stored.
   */
  public static async handleGoogleOAuthCallback(
    code: string,
    state: string
  ): Promise<void> {
    const { userId, provider } = JSON.parse(
      Buffer.from(state, 'base64').toString('utf8')
    );
    const oauth2Client = this.getGoogleOAuth2Client();

    try {
      logger.info(`Exchanging OAuth code for tokens for user: ${userId}`);
      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new BadRequestError(
          'Failed to retrieve access token from Google.'
        );
      }

      logger.info(
        `Tokens received. Encrypting and saving to database for user: ${userId}`
      );

      await IntegrationRepository.upsertIntegration({
        userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider: provider as any,
        accessToken: CryptoService.encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? CryptoService.encrypt(tokens.refresh_token)
          : undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scopes: [env.GOOGLE_CALENDAR_SCOPES],
        status: 'active',
      });

      logger.info(`Successfully saved integration for user: ${userId}`);
    } catch (error) {
      logger.error(`Error during Google OAuth callback for user ${userId}`, {
        error,
      });

      throw error;
    }
  }

  /**
   * Constructs the Notion OAuth authorization URL.
   * The state parameter is a base64 encoded JSON string containing the userId and provider
   * to identify the user upon callback.
   * @param {string} userId - The ID of the user initiating the connection.
   * @returns {string} The full Notion authorization URL.
   */
  public static generateNotionAuthUrl(userId: string): string {
    const state = Buffer.from(
      JSON.stringify({ userId, provider: 'notion' })
    ).toString('base64');

    return `https://api.notion.com/v1/oauth/authorize?client_id=${env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(env.NOTION_REDIRECT_URI)}&state=${state}`;
  }

  /**
   * Handles the server-side logic for the Notion OAuth callback. It exchanges the
   * authorization code for an access token and saves the integration details to the database.
   * @param {string} code - The authorization code from Notion's callback.
   * @param {string} state - The base64 encoded state string for verification.
   * @throws {BadRequestError} If the access token cannot be retrieved.
   * @returns {Promise<void>}
   */
  public static async handleNotionOAuthCallback(code: string, state: string) {
    const { userId } = JSON.parse(
      Buffer.from(state, 'base64').toString('utf-8')
    );

    const notion = new Client({
      auth: env.NOTION_CLIENT_SECRET,
    });

    const response = await notion.oauth.token({
      client_id: env.NOTION_CLIENT_ID,
      client_secret: env.NOTION_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.NOTION_REDIRECT_URI,
    });

    if (!response.access_token)
      throw new BadRequestError('Failed to retrieve Notion access token.');

    const encryptedAccessToken = CryptoService.encrypt(response.access_token);

    await IntegrationRepository.upsertIntegration({
      userId,
      provider: 'notion',
      accessToken: encryptedAccessToken,
      refreshToken: null,
      scopes: null,
      status: 'active',
    });
  }

  /**
   * Gathers all data for a given course and user, then creates a new summary page in Notion.
   * @param {string} userId - The ID of the user performing the export.
   * @param {string} courseId - The ID of the course to export.
   * @throws {ForbiddenError} If a valid Notion integration is not found for the user.
   * @throws {Error} If the access token fails to decrypt.
   * @returns {Promise<{pageUrl: string}>} An object containing the URL of the newly created Notion page.
   */
  public static async exportCourseToNotion(userId: string, courseId: string) {
    const integration = await db.query.userIntegrations.findFirst({
      where: and(
        eq(userIntegrations.userId, userId),
        eq(userIntegrations.provider, 'notion')
      ),
    });

    if (!integration || !integration.accessToken) {
      throw new ForbiddenError('Notion integration not found or is invalid.');
    }

    const accessToken = CryptoService.decrypt(integration.accessToken);
    if (!accessToken) {
      throw new Error('Failed to decrypt Notion access token.');
    }

    const courseResponse = await axios.get(
      `${env.COURSE_SERVICE_URL}/api/courses/${courseId}`
    );
    const notes = await NoteRepository.findNotesByUserAndCourse(
      userId,
      courseId
    );
    const board = await ResearchRepository.findOrCreateBoard(userId, courseId);

    const dataForHub = {
      course: courseResponse.data,
      notes: notes,
      findings: board.findings,
    };

    const notionClient = new NotionClient(accessToken);
    const pageUrl = await notionClient.createCourseHubPage(dataForHub);

    return { pageUrl };
  }
}
