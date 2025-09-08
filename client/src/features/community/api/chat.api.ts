import { communityService } from '@/lib/api/client';
import { Conversation } from '../types';

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
