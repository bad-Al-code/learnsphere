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
}
