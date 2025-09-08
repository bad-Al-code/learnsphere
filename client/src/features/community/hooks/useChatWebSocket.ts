import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { ClientToServerMessage, serverToClientMessageSchema } from '../schema';
import { Message } from '../types';

export function useChatWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

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
          const newMessage = validatedMessage.data.payload;

          queryClient.setQueryData(
            ['messages', newMessage.conversationId],
            (oldData: { pages: Message[][] } | undefined) => {
              if (!oldData) return oldData;

              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => [...page]),
              };

              newData.pages[0].unshift(newMessage as Message);
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
    if (ws.current?.readyState === WebSocket.OPEN) {
      const messageToSend: ClientToServerMessage = {
        type: 'DIRECT_MESSAGE',
        payload: message,
      };

      ws.current.send(JSON.stringify(messageToSend));
    } else {
      toast.error('Cannot send message. Chat is not connected.');
    }
  };

  return { sendMessage };
}
