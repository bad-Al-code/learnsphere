import { db } from '.';
import { auditLogActionEnum, auditLogs } from './schema';

type NewAuditLog = {
  action: (typeof auditLogActionEnum.enumValues)[number];
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
};

export class AuditRepository {
  /**
   * Creates a new audit log entry in the database.
   * @param logData The data for the new Audit log entry.
   */
  public static async create(logData: NewAuditLog): Promise<void> {
    await db.insert(auditLogs).values(logData);
  }
}
