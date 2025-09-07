import { db } from '..';
import { messages, NewMessage } from '../schema';

export class MessageRepository {
  /**
   * Creates a new message.
   * @param data - The data for the new message.
   * @returns The newly created message.
   */
  public static async create(
    data: NewMessage
  ): Promise<typeof messages.$inferSelect> {
    const [newMessage] = await db.insert(messages).values(data).returning();

    return newMessage;
  }
}
