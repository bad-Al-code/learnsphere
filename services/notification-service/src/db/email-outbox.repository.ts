import { db } from '.';
import { NewEmailLog } from '../types';
import { emailOutbox } from './schema';

export class EmailOutboxRepository {
  /**
   * Creats a new email log entry.
   * @param data The data for the new email log.
   */
  public static async create(data: NewEmailLog): Promise<void> {
    await db.insert(emailOutbox).values(data);
  }
}
