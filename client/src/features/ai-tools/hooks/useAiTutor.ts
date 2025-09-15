'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useAiTutorChat = (activeConversationId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<TutorChatActionResult, Error, TutorChatRequest>({
    mutationFn: askAiTutor,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ['ai-messages', activeConversationId],
      });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        'ai-messages',
        activeConversationId,
      ]);

      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: newMessage.prompt,
      };

      queryClient.setQueryData(
        ['ai-messages', activeConversationId],
        [...(previousMessages || []), optimisticMessage]
      );

      return { previousMessages };
    },

    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['ai-messages', activeConversationId],
          context.previousMessages
        );
      }

      toast.error(err.message);
    },

    onSettled: (data) => {
      const finalConversationId =
        data?.data?.conversationId || activeConversationId;

      if (finalConversationId) {
        queryClient.invalidateQueries({
          queryKey: ['ai-messages', finalConversationId],
        });
      }

      if (!activeConversationId && data?.data?.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      }
    },
  });
};
