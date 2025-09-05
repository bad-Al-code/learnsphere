'use client';

import { useWebSocket } from '@/hooks/use-web-socket';
import { useSessionStore } from '@/stores/session-store';

export function NotificationProvider() {
  const { user } = useSessionStore();

  useWebSocket(!!user);

  return null;
}
