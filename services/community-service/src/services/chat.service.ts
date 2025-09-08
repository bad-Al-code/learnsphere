import { ConversationRepository, MessageRepository } from '../db/repositories';
import { ForbiddenError } from '../errors';

export class ChatService {
  /**
   * Fetches all conversations for a specific user.
   * @param userId The ID of the user.
   * @returns A list of enriched conversation objects.
   */
  public static async getConversationsForUser(userId: string) {
    return ConversationRepository.findManyByUserId(userId);
  }

  /**
   * Fetches paginated messages for a given conversation, ensuring the user has access.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user requesting the messages.
   * @param options Pagination options (page, limit).
   * @returns A list of message objects.
   * @throws {ForbiddenError} If the user is not a participant of the conversation.
   */
  public static async getMessagesForConversation(
    conversationId: string,
    userId: string,
    options: { page: number; limit: number }
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      conversationId,
      userId
    );

    if (!isParticipant) {
      throw new ForbiddenError(
        'You are not authorized to view messages in this conversation.'
      );
    }

    const offset = (options.page - 1) * options.limit;
    return MessageRepository.findManyByConversationId(
      conversationId,
      options.limit,
      offset
    );
  }

  /**
   * Finds a direct conversation between two users, creating one if it doesn't exist.
   * @param initiatorId The ID of the user starting the conversation.
   * @param recipientId The ID of the user being messaged.
   * @returns The existing or newly created conversation.
   */
  public static async createOrGetDirectConversation(
    initiatorId: string,
    recipientId: string
  ) {
    const existingConversation =
      await ConversationRepository.findDirectConversation(
        initiatorId,
        recipientId
      );

    if (existingConversation) return existingConversation;

    const newConversation = await ConversationRepository.create(
      { type: 'direct' },
      [initiatorId, recipientId]
    );

    return newConversation;
  }
}
