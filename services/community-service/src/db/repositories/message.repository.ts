import { and, desc, eq, isNull, ne } from 'drizzle-orm';
import { db } from '..';
import { messages, NewMessage } from '../schema';

export class MessageRepository {
  /**
   * Creates a new message.
   * @param data - The data for the new message.
   * @returns The newly created message.
   */
  public static async create(data: NewMessage) {
    const [newMessage] = await db.insert(messages).values(data).returning();

    return db.query.messages.findFirst({
      where: eq(messages.id, newMessage.id),
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

  /**
   * Updates the `readAt` timestamp for all unread messages in a conversation for a specific recipient.
   * @param conversationId The ID of the conversation.
   * @param recipientId The ID of the user who has read the messages.
   * @returns A promise that resolves when the update is complete.
   */
  public static async markMessagesAsRead(
    conversationId: string,
    recipientId: string
  ): Promise<void> {
    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          ne(messages.senderId, recipientId),
          isNull(messages.readAt)
        )
      );
  }
}
