import { desc, eq } from 'drizzle-orm';

import { db } from '../../db';
import { UserIntegration, userIntegrations } from '../../db/schema';

export class IntegrationRepository {
  /**
   * Finds all integrations for a specific user.
   * @param userId The ID of the user.
   * @returns A list of the user's integration objects.
   */
  public static async findByUserId(userId: string): Promise<UserIntegration[]> {
    return db.query.userIntegrations.findMany({
      where: eq(userIntegrations.userId, userId),
      orderBy: [desc(userIntegrations.createdAt)],
    });
  }

  /**
   * Finds a single integration by its ID.
   * @param id The ID of the integration.
   * @returns The integration object or undefined.
   */
  public static async findById(
    id: string
  ): Promise<UserIntegration | undefined> {
    return db.query.userIntegrations.findFirst({
      where: eq(userIntegrations.id, id),
    });
  }

  /**
   * Deletes an integration from the database.
   * @param id The ID of the integration to delete.
   */
  public static async delete(id: string): Promise<void> {
    await db.delete(userIntegrations).where(eq(userIntegrations.id, id));
  }
}
