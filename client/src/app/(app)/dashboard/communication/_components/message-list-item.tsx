// src/app/(app)/dashboard/communication/_components/message-list-item.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils'; // Assuming you have a getInitials utility
import { Paperclip } from 'lucide-react';

// 1. Exported the Message type definition
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  preview: string;
  course: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  priority: 'High' | 'Normal';
  avatarUrl?: string;
}

interface MessageListItemProps {
  message: Message;
  isSelected: boolean;
}

// 2. Exported the MessageListItem component
export function MessageListItem({ message, isSelected }: MessageListItemProps) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer gap-3 rounded-md p-3 text-sm transition-colors',
        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50',
        message.priority === 'High' &&
          !isSelected &&
          'border-destructive border-l-2'
      )}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={message.avatarUrl} alt={message.name} />
        <AvatarFallback>{getInitials(message.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              'truncate font-semibold',
              !message.isRead && !isSelected && 'text-foreground'
            )}
          >
            {message.name}
          </p>
          <p
            className={cn(
              'flex-shrink-0 text-xs',
              isSelected
                ? 'text-primary-foreground/80'
                : 'text-muted-foreground'
            )}
          >
            {message.timestamp}
          </p>
        </div>
        <p
          className={cn(
            'truncate',
            !message.isRead && !isSelected && 'text-foreground font-bold'
          )}
        >
          {message.subject}
        </p>
        <p
          className={cn(
            'truncate text-xs',
            isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}
        >
          {message.preview}
        </p>
        <div className="flex items-center justify-between pt-1">
          <Badge
            variant={isSelected ? 'secondary' : 'default'}
            className="h-5 text-xs"
          >
            {message.course}
          </Badge>
          {message.hasAttachment && <Paperclip className="h-3.5 w-3.5" />}
        </div>
      </div>
    </div>
  );
}

// 3. Exported the MessageListItemSkeleton component
export function MessageListItemSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
