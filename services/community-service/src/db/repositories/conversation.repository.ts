import { and, asc, desc, eq, inArray, ne, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '..';
import {
  Conversation,
  conversationParticipants,
  conversations,
  messages,
  NewConversation,
  users,
} from '../schema';

export class ConversationRepository {
  /**
   * Find a conversation by ID.
   * @param conversationId - Conversation UUID
   * @returns Conversation object or null
   */
  public static async findById(conversationId: string) {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return result.length ? result[0] : null;
  }

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

    const conversationsResult = await db
      .with(lastMessageSubquery)
      .select({
        id: conversations.id,
        type: conversations.type,
        name: conversations.name,
        createdById: conversations.createdById,
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

    if (conversationsResult.length === 0) {
      return [];
    }

    return conversationsResult;
  }

  /**
   * Updates the lastReadTimestamp for a user in a specific conversation to the current time.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user.
   */
  public static async updateLastReadTimestamp(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await db
      .update(conversationParticipants)
      .set({ lastReadTimestamp: new Date() })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
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
   * Finds all participants for a conversation, including their user details.
   * @param conversationId The ID of the conversation.
   * @returns An array of participant objects with user details.
   */
  public static async findParticipantsWithDetails(conversationId: string) {
    return db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.conversationId, conversationId),
      with: {
        user: {
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

  /**
   * Add a participant to a conversation.
   * @param conversationId - Conversation UUID
   * @param userId - User UUID
   */
  public static async addParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await db
      .insert(conversationParticipants)
      .values({ conversationId, userId })
      .onConflictDoNothing();
  }

  /**
   * Remove a participant from a conversation.
   * @param conversationId - Conversation UUID
   * @param userId - User UUID
   */
  public static async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await db
      .delete(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );
  }

  /**
   * Finds public group conversations, enriched with participant details.
   * @param limit The maximum number of groups to return.
   * @returns An array of group conversations with their participants.
   */
  public static async findPublicGroups(limit: number = 5) {
    return db.query.conversations.findMany({
      where: eq(conversations.type, 'group'),
      orderBy: [desc(conversations.createdAt)],
      limit,
      with: {
        participants: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Finds a conversation by its name and the creator's ID.
   * @param name - The name of the conversation.
   * @param creatorId - The ID of the user who created the conversation.
   * @returns The first conversation matching the name and creator, or null if none exists.
   */
  public static async findByNameAndCreator(
    name: string,
    creatorId: string
  ): Promise<Conversation | undefined> {
    return db.query.conversations.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.name, name), eq(table.createdById, creatorId)),
    });
  }

  /**
   * Retrieves all group discussions for a specific course.
   * Includes participant information and orders results by creation date (newest first).
   * @param courseId - The ID of the course to fetch discussions for.
   * @returns An array of group discussions with participants and author information.
   */
  public static async findDiscussionsByCourse(courseId: string) {
    return db.query.conversations.findMany({
      where: and(
        eq(conversations.type, 'group'),
        eq(conversations.courseId, courseId)
      ),
      with: {
        participants: {
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [desc(conversations.createdAt)],
    });
  }

  /**
   * Retrieves all messages (replies) for a given conversation.
   * Orders messages by creation date (oldest first) and includes sender information.
   * @param conversationId - The ID of the conversation to fetch replies for.
   * @returns An array of messages with sender information.
   */
  public static async findReplies(conversationId: string) {
    return db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [asc(messages.createdAt)],
      with: { sender: true },
    });
  }

  /**
   * Toggles the bookmark status for a user in a conversation.
   * @param conversationId - The ID of the conversation
   * @param userId - The ID of the user toggling the bookmark
   */
  public static async toggleBookmark(conversationId: string, userId: string) {
    await db
      .update(conversationParticipants)
      .set({ isBookmarked: sql`NOT ${conversationParticipants.isBookmarked}` })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );
  }

  /**
   * Toggles the resolved status of a conversation.
   * @param conversationId - The ID of the conversation to toggle
   */
  public static async toggleResolved(conversationId: string) {
    await db
      .update(conversations)
      .set({ isResolved: sql`NOT ${conversations.isResolved}` })
      .where(eq(conversations.id, conversationId));
  }
}
