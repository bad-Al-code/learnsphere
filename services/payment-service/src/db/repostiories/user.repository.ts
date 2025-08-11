import { db } from '..';
import { NewUser } from '../../types';
import { users } from '../schema';

export class UserRepository {
  /**
   * Inserts or updates a user in the database.
   * @param data The user data to insert or update.
   */
  public static async upsert(data: NewUser): Promise<void> {
    await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.id,
        set: { role: data.role, email: data.email },
      });
  }
}
