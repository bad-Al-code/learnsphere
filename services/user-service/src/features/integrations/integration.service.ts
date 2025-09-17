import { OAuth2Client } from 'google-auth-library';
import { env } from '../../config/env';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../errors';
import { CryptoService } from '../../services/crypto.service';
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
   * Generates a Google OAuth 2.0 authorization URL for the given user.
   * @param {string} userId - The unique ID of the user requesting Google authentication.
   * @returns {string} A URL that the user can visit to grant access to their Google account.
   */
  public static generateGoogleAuthUrl(userId: string): string {
    const oauth2Client = this.getGoogleOAuth2Client();
    const scopes = [env.GOOGLE_CALENDAR_SCOPES];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId,
    });

    return url;
  }

  public static async handleGoogleOAuthCallback(code: string, state: string) {
    const userId = state;
    const oauth2Client = this.getGoogleOAuth2Client();

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new BadRequestError('Failed to retrieve tokens from Google.');
    }

    await IntegrationRepository.upsertIntegration({
      userId,
      provider: 'google_calendar',
      accessToken: CryptoService.encrypt(tokens.access_token),
      refreshToken: CryptoService.encrypt(tokens.refresh_token),
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      scopes: [env.GOOGLE_CALENDAR_SCOPES],
      status: 'active',
    });
  }
}
