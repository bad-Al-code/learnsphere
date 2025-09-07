import { db } from '..';
import { conversations, NewConversation } from '../schema';

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
}
