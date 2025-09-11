import { communityService } from '@/lib/api/client';
import { Conversation, Message, Participant } from '../types';

const GET_MESSAGE_LIMIT: string = '50';

/**
 * Fetches the list of conversations for the current user.
 * @returns A promise that resolves to an array of Conversation objects.
 */
export async function getConversations(): Promise<Conversation[]> {
  const response = await communityService.get<Conversation[]>(
    '/api/community/conversations'
  );

  return response.data;
}

/**
 * Fetches a paginated list of messages for a specific conversation.
 * @param conversationId The ID of the conversation.
 * @param page The page number to fetch.
 * @returns A promise that resolves to an array of Message objects.
 */
export async function getMessages({
  conversationId,
  pageParam = 1,
}: {
  conversationId: string;
  pageParam?: number;
}): Promise<Message[]> {
  const query = new URLSearchParams({
    page: pageParam.toString(),
    limit: GET_MESSAGE_LIMIT,
  });

  const response = await communityService.get<Message[]>(
    `/api/community/conversations/${conversationId}/messages?${query.toString()}`
  );
  return response.data;
}

/**
 * Creates or retrieves a direct conversation with a recipient.
 * @param recipientId The ID of the user to start a conversation with.
 * @returns A promise that resolves to the Conversation object.
 */
export async function createOrGetConversation(
  recipientId: string
): Promise<Conversation> {
  const response = await communityService.post<Conversation>(
    '/api/community/conversations',
    { recipientId }
  );
  return response.data;
}

/**
 * Marks all messages in a conversation as read.
 * @param conversationId The ID of the conversation.
 */
export async function markConversationAsRead(
  conversationId: string
): Promise<void> {
  try {
    await communityService.post(
      `/api/community/conversations/${conversationId}/read`,
      { conversationId }
    );
  } catch (error) {
    console.error('Failed to mark conversation as read:', error);
  }
}

/**
 * Creates a new group conversation.
 * @param name The name of the group.
 * @param participantIds An array of user IDs to include.
 * @returns A promise that resolves to the new Group Conversation object.
 */
export async function createGroupConversation(
  name: string,
  participantIds: string[]
): Promise<Conversation> {
  const response = await communityService.post<Conversation>(
    '/api/community/conversations/group',
    { name, participantIds }
  );

  return response.data;
}

export async function getConversationParticipants(
  conversationId: string
): Promise<Participant[]> {
  const response = await communityService.get<Participant[]>(
    `/api/community/conversations/${conversationId}/participants`
  );

  return response.data;
}
