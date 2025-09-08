import { and, desc, eq, inArray, ne, sql } from 'drizzle-orm';
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
   * Creates a new conversation and its initial participants within a transaction.
   * @param data The data for the new conversation.
   * @param participantIds An array of user IDs to add to the conversation.
   * @returns The newly created conversation.
   */
  public static async create(data: NewConversation, participantIds: string[]) {
    return db.transaction(async (tx) => {
      const [newConversation] = await tx
        .insert(conversations)
        .values(data)
        .returning();

      const participantData = participantIds.map((userId) => ({
        conversationId: newConversation.id,
        userId,
      }));

      await tx.insert(conversationParticipants).values(participantData);

      return newConversation;
    });
  }

  /**
   * Finds an existing direct conversation between two specific users.
   * @param userId1 The ID of the first user.
   * @param userId2 The ID of the second user.
   * @returns The conversation object if found, otherwise undefined.
   */
  public static async findDirectConversation(userId1: string, userId2: string) {
    const p1 = alias(conversationParticipants, 'p1');
    const p2 = alias(conversationParticipants, 'p2');

    const result = await db
      .select({ id: conversations.id })
      .from(conversations)
      .innerJoin(p1, eq(conversations.id, p1.conversationId))
      .innerJoin(p2, eq(conversations.id, p2.conversationId))
      .where(
        and(
          eq(conversations.type, 'direct'),
          eq(p1.userId, userId1),
          eq(p2.userId, userId2)
        )
      );

    if (result.length > 0) {
      return db.query.conversations.findFirst({
        where: eq(conversations.id, result[0].id),
        with: {
          participants: {
            with: {
              user: true,
            },
          },
        },
      });
    }
    return undefined;
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
   * Finds all participant IDs for a given conversation.
   * @param {string} conversationId - The ID of the conversation.
   * @returns {Promise<string[]>} An array of user IDs.
   */
  public static async findParticipantIds(
    conversationId: string
  ): Promise<string[]> {
    const participants = await db
      .select({ userId: conversationParticipants.userId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));

    return participants.map((p) => p.userId);
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

    return parseInt(result[0].count.toString(), 10) > 0;
  }

  public static async findManyByUserIdSimple(userId: string) {
    return db
      .select({ id: conversations.id })
      .from(conversations)
      .innerJoin(
        conversationParticipants,
        eq(conversations.id, conversationParticipants.conversationId)
      )
      .where(eq(conversationParticipants.userId, userId));
  }

  public static async findParticipantsForConversations(
    conversationIds: string[]
  ) {
    if (conversationIds.length === 0) return [];

    return db
      .select()
      .from(conversationParticipants)
      .where(inArray(conversationParticipants.conversationId, conversationIds));
  }
}
