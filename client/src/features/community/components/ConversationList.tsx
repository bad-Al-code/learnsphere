'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { Search } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';
import { Conversation } from '../types';
import { NewConversationDialog } from './NewConversationDialog';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onConversationCreated: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onConversationCreated,
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Direct Messages</h2>
          <NewConversationDialog
            onConversationCreated={onConversationCreated}
          />
        </div>

        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((convo) => {
            const displayName =
              convo.otherParticipant?.name || convo.name || 'Conversation';

            const initials = getInitials(displayName);

            const formattedTimestamp = convo.lastMessageTimestamp
              ? formatDistanceToNowStrict(
                  new Date(convo.lastMessageTimestamp),
                  { addSuffix: true }
                )
              : '';

            return (
              <div
                key={convo.id}
                onClick={() => onSelect(convo)}
                className={cn(
                  'hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2',
                  convo.id === selectedId && 'bg-muted hover:bg-muted'
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-semibold">{displayName}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {convo.lastMessage || 'No messages yet'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-muted-foreground text-xs whitespace-nowrap">
                    {formattedTimestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
