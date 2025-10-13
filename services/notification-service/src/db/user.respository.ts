import { eq } from 'drizzle-orm';
import { db } from '.';
import { User, users } from './schema';

type NewUser = typeof users.$inferInsert;

export class UserRepository {
  /**
   * Inserts or updates a user in the database.
   * If a user with the same ID exists, updates their role and email.
   *
   * @param {NewUser} data - The user data to insert or update.
   * @returns {Promise<void>}
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

  /**
   * Finds a user by their unique ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<NewUser | undefined>} The user record or undefined if not found.
   */
  public static async findById(id: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  }

  /**
   * Get the user by their unique email.
   * @param email The email of the user
   * @returns The user record.
   */
  public static async findByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  /**
   * Retrieves all users with the 'admin' role.
   *
   * @returns {Promise<NewUser[]>} A list of admin users.
   */
  public static async findAllAdmins() {
    return db.select().from(users).where(eq(users.role, 'admin'));
  }
}
