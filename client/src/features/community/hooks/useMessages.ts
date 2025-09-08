import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '../api/chat.api';
import type { Message } from '../types';

export function useMessages(conversationId: string | null) {
  return useInfiniteQuery<
    Message[],
    Error,
    InfiniteData<Message[]>,
    [string, string | null],
    number
  >({
    queryKey: ['messages', conversationId],

    queryFn: ({ pageParam = 1 }) =>
      getMessages({ conversationId: conversationId!, pageParam }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length + 1 : undefined;
    },

    enabled: !!conversationId,
    refetchOnWindowFocus: true,
  });
}
