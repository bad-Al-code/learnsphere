import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../db';
import {
  aiTutorConversations,
  aiTutorMessages,
  enrollments,
  NewAITutorMessage,
  replicatedCourseContent,
} from '../../db/schema';

export class AIRepository {
  /**
   * Inserts or updates a record in the replicated_course_content table.
   * If a record with the given courseId already exists, it updates the content and updatedAt fields. Otherwise, it inserts a new record.
   * @param courseId The UUID of the course.
   * @param content The full text content of the course.
   */
  public static async upsertCourseContent(
    courseId: string,
    content: string
  ): Promise<void> {
    await db
      .insert(replicatedCourseContent)
      .values({ courseId, content, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: replicatedCourseContent.courseId,
        set: { content, updatedAt: new Date() },
      });
  }

  /**
   * Deletes a record from the replicated_course_content table.
   * @param courseId The UUID of the course to delete.
   */
  public static async deleteCourseContent(courseId: string): Promise<void> {
    await db
      .delete(replicatedCourseContent)
      .where(eq(replicatedCourseContent.courseId, courseId));
  }

  /**
   * Creates a new enrollment record in the local replica.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   */
  public static async addEnrollment(
    userId: string,
    courseId: string
  ): Promise<void> {
    await db
      .insert(enrollments)
      .values({ userId, courseId })
      .onConflictDoNothing();
  }

  /**
   * Checks if a user is enrolled in a course using the local replica.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns True if an enrollment record exists, false otherwise.
   */
  public static async isUserEnrolled(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const result = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });

    return !!result;
  }

  /**
   * Finds a conversation for a user and course, or creates a new one if it doesn't exist.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns The conversation object.
   */
  public static async findOrCreateConversation(
    userId: string,
    courseId: string
  ) {
    const existing = await db.query.aiTutorConversations.findFirst({
      where: and(
        eq(aiTutorConversations.userId, userId),
        eq(aiTutorConversations.courseId, courseId)
      ),
    });

    if (existing) {
      return existing;
    }

    const [newConversation] = await db
      .insert(aiTutorConversations)
      .values({ userId, courseId })
      .returning();

    return newConversation;
  }

  /**
   * Adds a message to a conversation.
   * @param data The data for the new message.
   */
  public static async addMessage(data: NewAITutorMessage): Promise<void> {
    await db.insert(aiTutorMessages).values(data);
  }

  /**
   * Retrieves the most recent messages for a conversation.
   * @param conversationId The ID of the conversation.
   * @param limit The maximum number of messages to retrieve.
   * @returns An array of message objects.
   */
  public static async getMessages(conversationId: string, limit: number = 20) {
    return db.query.aiTutorMessages.findMany({
      where: eq(aiTutorMessages.conversationId, conversationId),
      orderBy: [desc(aiTutorMessages.createdAt)],
      limit,
    });
  }

  /**
   * Fetches the replicated content for a specific course.
   * @param courseId The UUID of the course.
   * @returns The replicated course content record or undefined if not found.
   */
  public static async getCourseContent(courseId: string) {
    return db.query.replicatedCourseContent.findFirst({
      where: eq(replicatedCourseContent.courseId, courseId),
    });
  }

  /**
   * Creates a new, empty conversation for a user and course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @param title The initial title for the conversation.
   * @returns The newly created conversation object.
   */
  public static async createConversation(
    userId: string,
    courseId: string,
    title: string
  ) {
    const [newConversation] = await db
      .insert(aiTutorConversations)
      .values({ userId, courseId, title })
      .returning();

    return newConversation;
  }

  /**
   * Finds a single conversation by its ID.
   * @param conversationId The ID of the conversation.
   * @returns The conversation object or undefined if not found.
   */
  public static async findConversationById(conversationId: string) {
    return db.query.aiTutorConversations.findFirst({
      where: eq(aiTutorConversations.id, conversationId),
    });
  }

  /**
   * Finds all conversations for a specific user.
   * @param userId The ID of the user.
   * @returns A list of the user's conversations, sorted by most recently updated.
   */
  public static async findConversationsByUserId(userId: string) {
    return db.query.aiTutorConversations.findMany({
      where: eq(aiTutorConversations.userId, userId),
      orderBy: [desc(aiTutorConversations.updatedAt)],
    });
  }

  /**
   * Finds all conversations for a specific user and course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course to filter by.
   * @returns A list of the user's conversations for that course.
   */
  public static async findConversationsByUserAndCourse(
    userId: string,
    courseId: string
  ) {
    return db.query.aiTutorConversations.findMany({
      where: and(
        eq(aiTutorConversations.userId, userId),
        eq(aiTutorConversations.courseId, courseId)
      ),
      orderBy: [desc(aiTutorConversations.updatedAt)],
    });
  }

  /**
   * Updates the title of a conversation.
   * @param conversationId The ID of the conversation to update.
   * @param title The new title.
   */
  public static async updateConversationTitle(
    conversationId: string,
    title: string
  ): Promise<void> {
    await db
      .update(aiTutorConversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(aiTutorConversations.id, conversationId));
  }

  /**
   * Deletes a conversation and all its associated messages.
   * @param conversationId The ID of the conversation to delete.
   */
  public static async deleteConversation(
    conversationId: string
  ): Promise<void> {
    await db
      .delete(aiTutorConversations)
      .where(eq(aiTutorConversations.id, conversationId));
  }
}
