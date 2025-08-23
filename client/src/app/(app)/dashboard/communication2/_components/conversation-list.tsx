'use client';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Conversation,
  ConversationLink,
  ConversationLinkSkeleton,
} from './conversation-link';

const placeholderConversations: Conversation[] = [
  {
    id: '1',
    name: 'General',
    statusText: '3 new messages',
    userStatus: 'online',
    notificationCount: 3,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    statusText: 'Typing...',
    userStatus: 'online',
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    statusText: 'Online',
    userStatus: 'online',
  },
  {
    id: '4',
    name: 'Web Dev Group',
    statusText: '1 new mention',
    userStatus: 'offline',
    notificationCount: 1,
  },
  { id: '5', name: 'Emma Thompson', statusText: 'Away', userStatus: 'away' },
  {
    id: '6',
    name: 'David Kim',
    statusText: 'Do not disturb',
    userStatus: 'dnd',
  },
  { id: '7', name: 'Lisa Wang', statusText: 'Offline', userStatus: 'offline' },
  { id: '8', name: 'Lisa Wang', statusText: 'Offline', userStatus: 'offline' },
  { id: '9', name: 'Lisa Wang', statusText: 'Offline', userStatus: 'offline' },
  { id: '10', name: 'Lisa Wang', statusText: 'Offline', userStatus: 'offline' },
  { id: '11', name: 'Lisa Wang', statusText: 'Offline', userStatus: 'offline' },
];

interface ConversationListProps {
  conversations?: Conversation[];
}

export function ConversationList({
  conversations = placeholderConversations,
}: ConversationListProps) {
  const [selectedId, setSelectedId] = useState('2');

  return (
    <div className="bg-muted/30 flex h-full flex-col">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input placeholder="Search" className="pl-8" />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        <h2 className="text-muted-foreground px-1 py-1 text-xs font-semibold uppercase">
          Direct Messges
        </h2>
        {conversations.map((convo) => (
          <div key={convo.id} onClick={() => setSelectedId(convo.id)}>
            <ConversationLink
              conversation={convo}
              isActive={selectedId === convo.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="bg-muted/30 flex h-full flex-col">
      <div className="flex-shrink-0 border-b p-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex-1 space-y-1 p-2">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 7 }).map((_, i) => (
          <ConversationLinkSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
