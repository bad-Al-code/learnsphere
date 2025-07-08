import { eq } from 'drizzle-orm';
import { db } from './index';
import { userSessions } from './schema';

type NewSession = typeof userSessions.$inferInsert;
export type Session = typeof userSessions.$inferSelect;

export class SessionRepository {
  public static async create(newSession: NewSession): Promise<void> {
    await db.insert(userSessions).values(newSession);
  }

  public static async findById(jti: string): Promise<Session | undefined> {
    return db.query.userSessions.findFirst({
      where: eq(userSessions.jti, jti),
    });
  }

  public static async findByUserId(userId: string): Promise<Session[]> {
    return db.query.userSessions.findMany({
      where: eq(userSessions.userId, userId),
    });
  }

  public static async deleteById(jti: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.jti, jti));
  }

  public static async deleteAllForUser(userId: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.userId, userId));
  }
}
