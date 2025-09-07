import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '..';
import {
  conversationParticipants,
  conversations,
  messages,
  NewConversation,
  users,
} from '../schema';

export class ConversationRepository {
  /**
   * Creates a new conversation.
   * @param data The data for the new conversation.
   * @returns The newly created conversation.
   */
  public static async create(data: NewConversation) {
    const [newConversation] = await db
      .insert(conversations)
      .values(data)
      .returning();

    return newConversation;
  }

  /**
   * Finds all conversations for a given user, including the last message
   * and the details of the other participant (for direct messages).
   * @param {string} userId - The ID of the user.
   */
  public static async findManyByUserId(userId: string) {
    const p1 = alias(conversationParticipants, 'p1');
    const p2 = alias(conversationParticipants, 'p2');
    const otherUser = alias(users, 'otherUser');

    const lastMessageSubquery = db.$with('last_message_sq').as(
      db
        .select({
          conversationId: messages.conversationId,
          content: messages.content,
          createdAt: messages.createdAt,
          rowNumber:
            sql`ROW_NUMBER() OVER (PARTITION BY ${messages.conversationId} ORDER BY ${messages.createdAt} DESC)`.as(
              'rn'
            ),
        })
        .from(messages)
    );

    return db
      .with(lastMessageSubquery)
      .select({
        id: conversations.id,
        type: conversations.type,
        name: conversations.name,
        lastMessage: lastMessageSubquery.content,
        lastMessageTimestamp: lastMessageSubquery.createdAt,
        otherParticipant: {
          id: otherUser.id,
          name: otherUser.name,
          avatarUrl: otherUser.avatarUrl,
        },
      })
      .from(conversations)
      .innerJoin(p1, eq(conversations.id, p1.conversationId))
      .leftJoin(
        lastMessageSubquery,
        and(
          eq(lastMessageSubquery.conversationId, conversations.id),
          eq(lastMessageSubquery.rowNumber, 1)
        )
      )
      .leftJoin(
        p2,
        and(eq(conversations.id, p2.conversationId), ne(p2.userId, userId))
      )
      .leftJoin(otherUser, eq(p2.userId, otherUser.id))
      .where(eq(p1.userId, userId))
      .orderBy(
        desc(
          sql`COALESCE(${lastMessageSubquery.createdAt}, ${conversations.updatedAt})`
        )
      );
  }

  /**
   * Checks if a user is a participant in a specific conversation.
   * @param {string} conversationId - The ID of the conversation.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<boolean>} True if the user is a participant, false otherwise.
   */
  public static async isUserParticipant(
    conversationId: string,
    userId: string
  ): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );

    return result[0].count > 0;
  }
}
