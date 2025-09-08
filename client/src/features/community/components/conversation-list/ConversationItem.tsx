'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  const displayName =
    conversation.otherParticipant?.name || conversation.name || 'Conversation';
  const initials = getInitials(displayName);
  const formattedTimestamp = conversation.lastMessageTimestamp
    ? formatDistanceToNowStrict(new Date(conversation.lastMessageTimestamp), {
        addSuffix: true,
      })
    : '';

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={cn(
        'hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2',
        isSelected && 'bg-muted hover:bg-muted'
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {conversation.otherParticipant?.status && (
          <span
            className={cn(
              'border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2',
              conversation.otherParticipant.status === 'online'
                ? 'bg-emerald-500'
                : 'bg-foreground/30'
            )}
          />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="truncate font-semibold">{displayName}</p>
        <p className="text-muted-foreground truncate text-xs">
          {conversation.lastMessage || 'No messages yet'}
        </p>
      </div>

      <div className="text-right">
        <p className="text-muted-foreground text-xs whitespace-nowrap">
          {formattedTimestamp}
        </p>
      </div>
    </div>
  );
}

export function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-4 w-8" />
    </div>
  );
}
