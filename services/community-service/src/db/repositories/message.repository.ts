import { desc, eq } from 'drizzle-orm';
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

  /**
   * Finds messages for a conversation with pagination.
   * @param {string} conversationId - The ID of the conversation.
   * @param {number} limit - The number of messages to return.
   * @param {number} offset - The number of messages to skip.
   */
  public static async findManyByConversationId(
    conversationId: string,
    limit: number = 50,
    offset: number
  ) {
    return db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [desc(messages.createdAt)],
      limit,
      offset,
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
