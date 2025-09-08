import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useSessionStore } from '@/stores/session-store';
import { v4 as uuidv4 } from 'uuid';
import { ClientToServerMessage, serverToClientMessageSchema } from '../schema';
import { Message } from '../types';

export function useChatWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const currentUser = useSessionStore((state) => state.user);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_COMMUNITY_WS_URL || 'ws://localhost:8007'
    );

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const validatedMessage =
          serverToClientMessageSchema.safeParse(messageData);

        if (validatedMessage.success) {
          const newMessage = validatedMessage.data.payload as Message;

          queryClient.setQueryData(
            ['messages', newMessage.conversationId],
            (oldData: { pages: Message[][] } | undefined) => {
              if (!oldData) return oldData;

              const newData = { ...oldData, pages: [...oldData.pages] };

              newData.pages[newData.pages.length - 1].push(newMessage);
              return newData;
            }
          );
        } else {
          console.warn('Received invalid message from server:', messageData);
        }
      } catch (error) {
        console.error('Error processing incoming WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection to chat server lost.');
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [queryClient]);

  const sendMessage = (message: ClientToServerMessage['payload']) => {
    if (!currentUser) {
      toast.error('You must be logged in to send messages.');
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      const messageToSend: ClientToServerMessage = {
        type: 'DIRECT_MESSAGE',
        payload: message,
      };

      ws.current.send(JSON.stringify(messageToSend));

      const optimisticMessage: Message = {
        id: uuidv4(),
        conversationId: message.conversationId,
        senderId: currentUser.userId,
        content: message.content,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser.userId,
          name: currentUser.firstName || 'You',
          avatarUrl: currentUser.avatarUrls!.small || null,
        },
      };

      queryClient.setQueryData(
        ['messages', message.conversationId],

        (oldData: { pages: Message[][] } | undefined) => {
          if (!oldData) return { pages: [[optimisticMessage]] };

          const newData = { ...oldData, pages: [...oldData.pages] };
          newData.pages[newData.pages.length - 1].push(optimisticMessage);

          return newData;
        }
      );
    } else {
      toast.error('Cannot send message. Chat is not connected.');
    }
  };

  return { sendMessage };
}
