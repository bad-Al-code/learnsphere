import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../api/chat.api';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
}
