import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useSessionStore } from '@/stores/session-store';

import { markConversationAsRead } from '../api/chat.api';
import { ClientToServerMessage, serverToClientMessageSchema } from '../schema';
import { Conversation, Message } from '../types';

export function useChatWebSocket(selectedConversationId: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const currentUser = useSessionStore((state) => state.user);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_COMMUNITY_WS_URL || 'ws://localhost:8007'
    );

    // socket.onopen = () => console.log('WebSocket connected');
    // socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection to chat server lost.');
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const validatedServerMessage =
          serverToClientMessageSchema.safeParse(messageData);

        if (!validatedServerMessage.success) {
          console.warn(
            'Received invalid or unhandled message type from server:',
            validatedServerMessage.error
          );
          return;
        }

        const { type, payload } = validatedServerMessage.data;

        if (type === 'NEW_MESSAGE') {
          if (payload.conversationId === selectedConversationId) {
            markConversationAsRead(payload.conversationId);
          } else {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }

          queryClient.setQueryData(
            ['messages', payload.conversationId],
            (oldData: { pages: Message[][] } | undefined) => {
              if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                return { pages: [[payload as Message]], pageParams: [1] };
              }
              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => [...page]),
              };
              newData.pages[0].unshift(payload as Message);
              return newData;
            }
          );
        } else if (type === 'TYPING_UPDATE') {
          const { conversationId, userName, isTyping } = payload;
          queryClient.setQueryData(
            ['conversations'],
            (oldData: Conversation[] | undefined) => {
              if (!oldData) return oldData;
              return oldData.map((convo) => {
                if (convo.id === conversationId) {
                  return {
                    ...convo,
                    typingUser: isTyping ? { name: userName } : undefined,
                  };
                }
                return convo;
              });
            }
          );
        } else if (type === 'PRESENCE_UPDATE') {
          queryClient.setQueryData(
            ['conversations'],
            (oldData: Conversation[] | undefined) => {
              if (!oldData) return oldData;
              return oldData.map((convo) => {
                if (convo.otherParticipant?.id === payload.userId) {
                  return {
                    ...convo,
                    otherParticipant: {
                      ...convo.otherParticipant,
                      status: payload.status,
                    },
                  };
                }
                return convo;
              });
            }
          );
        } else if (type === 'MESSAGES_READ') {
          const { conversationId, readByUserId, readAt } = payload;
          queryClient.setQueryData(
            ['messages', conversationId],
            (oldData: { pages: Message[][] } | undefined) => {
              if (!oldData) return oldData;

              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) =>
                  page.map((msg) => {
                    if (msg.senderId !== readByUserId && !msg.readAt) {
                      return { ...msg, readAt: readAt };
                    }
                    return msg;
                  })
                ),
              };
              return newData;
            }
          );
        }
      } catch (error) {
        console.error('Error processing incoming WebSocket message:', error);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [queryClient]);

  const sendEvent = (
    event: ClientToServerMessage,
    replyingTo?: Message | null
  ) => {
    if (!currentUser) {
      toast.error('You must be logged in to perform this action.');
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(event));

      if (event.type === 'DIRECT_MESSAGE') {
        const { conversationId, content, replyingToMessageId } = event.payload;

        const optimisticMessage: Message = {
          id: uuidv4(),
          conversationId: conversationId,
          senderId: currentUser.userId,
          content: content,
          createdAt: new Date().toISOString(),
          readAt: null,
          replyingTo: replyingTo || null,
          sender: {
            id: currentUser.userId,
            name: currentUser.firstName || 'You',
            avatarUrl: currentUser.avatarUrls?.small || null,
          },
        };
        // TODO
        if (replyingToMessageId) {
        }

        queryClient.setQueryData(
          ['messages', conversationId],
          (oldData: { pages: Message[][] } | undefined) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return { pages: [[optimisticMessage]], pageParams: [1] };
            }
            const newData = {
              ...oldData,
              pages: oldData.pages.map((p) => [...p]),
            };
            newData.pages[0].unshift(optimisticMessage);
            return newData;
          }
        );
      }
    } else {
      toast.error('Cannot perform action. Chat is not connected.');
    }
  };

  return { sendEvent };
}
