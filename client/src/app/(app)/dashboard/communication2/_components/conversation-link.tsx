'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { UserAvatar } from './user-avatar';

export interface Conversation {
  id: string;
  name: string;
  statusText: string;
  avatarUrl?: string;
  userStatus: 'online' | 'away' | 'dnd' | 'offline';
  notificationCount?: number;
}

interface ConversationLinkProps {
  conversation: Conversation;
  isActive?: boolean;
}

export function ConversationLink({
  conversation,
  isActive = false,
}: ConversationLinkProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-md p-2',
        isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
      )}
    >
      <div className="flex items-center gap-3">
        <UserAvatar
          name={conversation.name}
          imageUrl={conversation.avatarUrl}
          status={conversation.userStatus}
          size="sm"
        />
        <div>
          <p className="font-semibold">{conversation.name}</p>
          <p className="text-muted-foreground text-xs">
            {conversation.statusText}
          </p>
        </div>
      </div>
      {conversation.notificationCount && conversation.notificationCount > 0 && (
        <Badge className="h-5 shrink-0">{conversation.notificationCount}</Badge>
      )}
    </div>
  );
}

export function ConversationLinkSkeleton() {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  );
}
