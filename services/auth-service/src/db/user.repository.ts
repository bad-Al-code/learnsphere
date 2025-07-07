import { and, eq } from 'drizzle-orm';

import { db } from '.';
import { NewUser, User } from './database.types';
import { users } from './schema';

type UpdatableUserFields = Partial<Omit<User, 'id' | 'createdAt'>>;

export class UserRepository {
  public static async findByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  public static async findById(id: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  }

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

  public static async updateUser(
    id: string,
    data: UpdatableUserFields
  ): Promise<void> {
    await db.update(users).set(data).where(eq(users.id, id));
  }
}
