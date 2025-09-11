import { useQuery } from '@tanstack/react-query';
import { getConversationParticipants } from '../api/chat.api';

export function useParticipants(conversationId: string | null) {
  return useQuery({
    queryKey: ['participants', conversationId],

    queryFn: () => getConversationParticipants(conversationId!),
    enabled: !!conversationId,
  });
}
