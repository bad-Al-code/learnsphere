'use client';

import { Notification } from '@/lib/api/notification';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const NOTIFICATION_SERVICE_WS_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL?.replace('http', 'ws');

export function useWebSocket(enabled: boolean) {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    if (!NOTIFICATION_SERVICE_WS_URL) {
      console.error(
        'WebSocket URL is not defined. NEXT_PUBLIC_NOTIFICATION_SERVICE_URL must be set.'
      );
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    const socket = new WebSocket(NOTIFICATION_SERVICE_WS_URL);

    socket.onopen = () => {
      // console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);

        toast.info(notification.content, {
          action: notification.linkUrl
            ? {
                label: 'View',
                onClick: () =>
                  window.open(notification.linkUrl as string, '_blank'),
              }
            : undefined,
        });

        queryClient.setQueryData<Notification[]>(
          ['notifications'],
          (oldData) => {
            return oldData ? [notification, ...oldData] : [notification];
          }
        );
      } catch (error) {
        console.error('Failed to parse incoming WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      // console.error('WebSocket error:', error);
      // toast.error('WebSocket connection error. Please try again later.');
    };

    socket.onclose = () => {
      // console.log('WebSocket connection closed.');
      // toast.warning('WebSocket connection closed.');
    };

    ws.current = socket;

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [enabled, queryClient]);
}
