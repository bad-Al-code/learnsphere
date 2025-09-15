'use client';

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { askAiTutor } from '../actions/chat';
import { TutorChatRequest } from '../schemas/chat.schema';
import { ChatMessage } from '../types/inedx';

type TutorChatActionResult = {
  data?: {
    response: string;
    conversationId: string;
  };
  error?: string;
};

type InfiniteMessages = InfiniteData<{
  messages: ChatMessage[];
  nextPage?: number;
}>;

export const useAiTutorChat = (activeConversationId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<TutorChatActionResult, Error, TutorChatRequest>({
    mutationFn: askAiTutor,

    onMutate: async (newMessage) => {
      const queryKey = ['ai-messages', activeConversationId];
      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<InfiniteMessages>(queryKey);

      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: newMessage.prompt,
      };

      queryClient.setQueryData(
        queryKey,
        (oldData: InfiniteMessages | undefined) => {
          if (!oldData) {
            return {
              pages: [{ messages: [optimisticMessage], nextPage: undefined }],
              pageParams: [1],
            };
          }

          const newPages = [...oldData.pages];
          const lastPageIndex = newPages.length - 1;
          const lastPage = newPages[lastPageIndex];

          newPages[lastPageIndex] = {
            ...lastPage,
            messages: [...lastPage.messages, optimisticMessage],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      return { previousMessages };
    },

    onError: (err, variables, context) => {
      const typedContext = context as { previousMessages?: InfiniteMessages };

      if (typedContext?.previousMessages) {
        queryClient.setQueryData(
          ['ai-messages', activeConversationId],
          typedContext.previousMessages
        );
      }

      toast.error(err.message);
    },

    onSettled: (data, error, variables) => {
      const finalConversationId =
        data?.data?.conversationId || activeConversationId;

      if (finalConversationId) {
        queryClient.invalidateQueries({
          queryKey: ['ai-messages', finalConversationId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['ai-conversations', variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ['ai-conversations'],
      });
    },
  });
};
