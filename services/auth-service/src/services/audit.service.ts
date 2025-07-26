import logger from '../config/logger';
import { AuditRepository } from '../db/audit.repository';
import { auditLogActionEnum } from '../db/schema';

type LogEventData = {
  action: (typeof auditLogActionEnum.enumValues)[number];
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
};

export class AuditService {
  /**
   * @param eventData The data for the event to be logged.
   */
  public static async logEvent(eventData: LogEventData): Promise<void> {
    try {
      await AuditRepository.create({
        ...eventData,
        userId: eventData.userId || null,
        ipAddress: eventData.ipAddress || null,
        userAgent: eventData.userAgent || null,
        details: eventData.details || null,
      });
    } catch (error) {
      logger.error('Failed to write to audit log', {
        error,
        auditEventData: eventData,
      });
    }
  }
}
