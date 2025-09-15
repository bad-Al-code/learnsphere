'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createConversationAction,
  deleteConversationAction,
  getConversationsAction,
  getMessagesAction,
  renameConversationAction,
} from '../actions/chat';
import { getEnrolledCoursesAction } from '../actions/enrollment';
import { Conversation } from '../schemas/chat.schema';

export const useGetConversations = (courseId: string) => {
  return useQuery({
    queryKey: ['ai-conversations', courseId],
    queryFn: async () => {
      const result = await getConversationsAction(courseId);

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
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });

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

    onSuccess: (data, variables_conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });

      queryClient.setQueryData(
        ['ai-conversations'],
        (oldData: Conversation[] | undefined) =>
          oldData?.filter((convo) => convo.id !== variables_conversationId)
      );
    },
  });
};

export const useGetMessages = (conversationId: string | null) => {
  return useInfiniteQuery({
    queryKey: ['ai-messages', conversationId],

    queryFn: async ({ pageParam = 1 }) => {
      if (!conversationId) return { messages: [], nextPage: undefined };

      const result = await getMessagesAction(conversationId, pageParam);
      if (result.error) throw new Error(result.error);

      return {
        messages: result.data?.reverse() || [],
        nextPage:
          (result.data?.length || 0) === 100 ? pageParam + 1 : undefined,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!conversationId,
  });
};

export const useGetEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolled-courses'],

    queryFn: async () => {
      const result = await getEnrolledCoursesAction();

      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
