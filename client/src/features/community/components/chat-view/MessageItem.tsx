'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { formatDistanceToNowStrict } from 'date-fns';
import { Message } from '../../types';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const currentUser = useSessionStore((state) => state.user);
  const isCurrentUser = message.senderId === currentUser?.userId;

  return (
    <div
      key={message.id}
      className={cn('flex items-end gap-2', isCurrentUser && 'justify-end')}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatarUrl || undefined} />
          <AvatarFallback>{getInitials(message.sender?.name)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs rounded-lg p-2 text-sm',
          message.senderId === currentUser?.userId
            ? 'from-secondary/50 to-secondary text-primary bg-gradient-to-r'
            : 'from-secondary/50 to-secondary bg-gradient-to-r'
        )}
      >
        <p>{message.content}</p>
        <p
          className={cn(
            'mt-1 text-end text-xs',
            message.senderId ? 'text-primary/70' : 'text-muted-foreground'
          )}
        >
          {formatDistanceToNowStrict(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
