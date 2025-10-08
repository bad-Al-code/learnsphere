import { eq } from 'drizzle-orm';

import { db } from '..';
import { NewUser, users } from '../schema';

export class UserRepository {
  /**
   * Creates or updates a user in the local replica.
   * @param data The user data from an event.
   */
  public static async upsert(data: NewUser) {
    await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: data.name,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Retrieves the username of a user by their unique ID.
   * @param id The UUID of the user.
   * @returns The user's name if found, otherwise `null`.
   */
  public static async getUsernameByUserId(id: string): Promise<string | null> {
    const [result] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result.name;
  }
}
