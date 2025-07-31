import logger from '../config/logger';
import { Session, SessionRepository } from '../db/session.repository';
import { RequestContext } from '../types/service.types';

export class SessionService {
  /**
   * Creates and records a new user session.
   * @param jti The JWT ID of the token associated with this session.
   * @param userId The ID of the user.
   * @param context The request context (IP, user agent).
   */
  public static async createSession(
    jti: string,
    userId: string,
    context: RequestContext
  ): Promise<void> {
    try {
      await SessionRepository.create({
        jti,
        userId,
        ipAddress: context.ipAddress || null,
        userAgent: context.userAgent || null,
      });
    } catch (error) {
      logger.error('Failed to create user session record', { error, userId });
    }
  }

  /**
   * Retrieves all active sessions for a given user.
   * @param userId The ID of the user.
   * @returns An array of session objects.
   */
  public static async getUserSessions(
    userId: string,
    limit?: number
  ): Promise<Session[]> {
    return SessionRepository.findByUserId(userId, limit);
  }

  /**
   * Deletes a specific session by its JTI (logs the user out of that device).
   * @param jti The JTI of the session to terminate.
   */
  public static async terminateSession(jti: string): Promise<void> {
    await SessionRepository.deleteById(jti);
    logger.info(`Terminated session with JTI: ${jti}`);
  }
}
