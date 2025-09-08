import { communityService } from '@/lib/api/client';
import { Conversation, Message } from '../types';

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
