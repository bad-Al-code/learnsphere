import { and, eq } from 'drizzle-orm';

import { db } from '.';
import { NewUser, User } from './database.types';
import { users } from './schema';

type UpdatableUserFields = Partial<Omit<User, 'id' | 'createdAt'>>;

export class UserRepository {
  /**
   * Find a single user by their email address.
   * @param email The user's email.
   * @returns A user object or undefined if not found.
   */
  public static async findByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  /**
   * Finds a single user by their ID.
   * @param id The user's UUID.
   * @returns A user object or undefined if not found.
   */
  public static async findById(id: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  }

  /**
   * Finds a user by matching their email and a non-expired verification token.
   * @param email The user's email.
   * @param hashedToken The hashed verification token.
   * @returns A user object or undefined if not found.
   */
  public static async findByEmailAndVerificationToken(
    email: string,
    hashedToken: string
  ): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: and(
        eq(users.email, email),
        eq(users.verificationToken, hashedToken)
      ),
    });
  }

  /**
   * Finds a user by matching their email and a non-expired password reset token.
   * @param email The user's email.
   * @param hashedToken The hashed password reset token.
   * @returns A user object or undefined if not found.
   */
  public static async findByEmailAndPasswordResetToken(
    email: string,
    hashedToken: string
  ): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: and(
        eq(users.email, email),
        eq(users.passwordResetToken, hashedToken)
      ),
    });
  }

  /**
   * Creates a new user in the database.
   * @param newUser An object conforming to the Drizzle NewUser type.
   * @returns The newly created user's essential fields (id, email, role).
   */
  public static async create(newUser: NewUser): Promise<{
    id: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
  }> {
    const [createdUser] = await db
      .insert(users)
      .values(newUser)
      .returning({ id: users.id, email: users.email, role: users.role });

    if (!createdUser.id) {
      throw new Error('User creation failed: ID is null');
    }

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };
  }

  /**
   * Updates an existing user's data by their ID.
   * @param id The UUID of the user to update.
   * @param data An object containing the fields to update.
   */
  public static async updateUser(
    id: string,
    data: UpdatableUserFields
  ): Promise<void> {
    await db.update(users).set(data).where(eq(users.id, id));
  }
}
