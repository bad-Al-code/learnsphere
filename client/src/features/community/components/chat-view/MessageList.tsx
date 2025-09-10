'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef } from 'react';
import { Conversation, Message } from '../../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  conversationType: Conversation['type'];
}

export function MessageList({ messages, conversationType }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            conversationType={conversationType}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-end gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-16 w-48 rounded-lg" />
      </div>
      <div className="flex items-end justify-end gap-2">
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
      <div className="flex items-end gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-20 w-56 rounded-lg" />
      </div>
    </div>
  );
}
