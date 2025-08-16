import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import logger from '../config/logger';
import { BlacklistService } from '../controllers/blacklist-service';
import { Session, SessionRepository } from '../db/session.repository';
import { UserSessionCreatedPublisher } from '../events/publisher';
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
      const geoInfo = await this.getGeoInfo(context.ipAddress);
      const parser = new UAParser(context.userAgent);
      const deviceType = parser.getDevice().type || 'desktop';

      await SessionRepository.create({
        jti,
        userId,
        ipAddress: context.ipAddress || null,
        userAgent: context.userAgent || null,
        country: geoInfo.country,
        countryCode: geoInfo.countryCode,
        deviceType: deviceType,
      });

      try {
        const publisher = new UserSessionCreatedPublisher();

        await publisher.publish({ userId, deviceType });
      } catch (error) {
        logger.error('Failed to publish user.session.created event', {
          error,
          userId,
        });
      }
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

  /**
   * Terminall all sessions except current logged in
   * @param userId The ID of the user
   * @param currentJti Current logged in user JWT
   */
  public static async terminateAllOtherSessions(
    userId: string,
    currentJti: string
  ): Promise<void> {
    const sessionsToDelete = await SessionRepository.findByUserId(userId);
    for (const session of sessionsToDelete) {
      if (session.jti !== currentJti) {
        await BlacklistService.addToBlacklist(session.jti, 0);
      }
    }

    await SessionRepository.deleteAllForUserExceptCurrent(userId, currentJti);

    logger.info(
      `Terminated all other sessions for user ${userId}, excluding current session ${currentJti}`
    );
  }

  private static async getGeoInfo(
    ipAddress?: string
  ): Promise<{ country: string | null; countryCode: string | null }> {
    if (
      !ipAddress ||
      ipAddress === '::1' ||
      ipAddress.startsWith('127.') ||
      ipAddress.startsWith('192.168.')
    ) {
      return { country: null, countryCode: null };
    }

    logger.info(`Getting the geoLocation for IPAddress: ${ipAddress}`);
    try {
      const response = await axios.get(
        `http://ip-api.com/json/${ipAddress}?fields=country,countryCode`
      );

      return {
        country: response.data.country || null,
        countryCode: response.data.countryCode || null,
      };
    } catch (error) {
      logger.warn(`Failed to fetch GeoIP info for IP: ${ipAddress}`, { error });
      return { country: null, countryCode: null };
    }
  }
}
