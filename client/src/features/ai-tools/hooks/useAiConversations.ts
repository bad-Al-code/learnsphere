'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createConversationAction,
  deleteConversationAction,
  getConversationsAction,
  renameConversationAction,
} from '../actions/chat';
import { Conversation } from '../schemas/chat.schema';

export const useGetConversations = () => {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const result = await getConversationsAction();

      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversationAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
};

export const useRenameConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renameConversationAction,

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['ai-conversations'],

        (oldData: Conversation[] | undefined) =>
          oldData?.map((convo) =>
            convo.id === variables.conversationId
              ? { ...convo, title: variables.title }
              : convo
          )
      );
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversationAction,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
};
