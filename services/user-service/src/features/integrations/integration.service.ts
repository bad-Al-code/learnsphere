import { ForbiddenError, NotFoundError } from '../../errors';
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
}
