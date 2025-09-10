'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { formatDistanceToNowStrict } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Conversation, Message } from '../../types';

interface MessageItemProps {
  message: Message;
  conversationType: Conversation['type'];
}

export function MessageItem({ message, conversationType }: MessageItemProps) {
  const currentUser = useSessionStore((state) => state.user);
  const isCurrentUser = message.senderId === currentUser?.userId;
  const showSenderInfo = conversationType === 'group' && !isCurrentUser;

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
          'flex flex-col',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        {showSenderInfo && (
          <p className="text-muted-foreground mb-1 ml-2 text-xs">
            {message.sender?.name}
          </p>
        )}

        <div
          className={cn(
            'max-w-xs rounded-lg p-2 text-sm',
            isCurrentUser
              ? 'from-secondary/50 to-secondary text-primary bg-gradient-to-r'
              : 'from-secondary/50 to-secondary bg-gradient-to-r'
          )}
        >
          <p>{message.content}</p>
          <div className="text-muted-foreground/80 mt-1 flex items-center justify-end gap-1.5 text-xs">
            <span>
              {formatDistanceToNowStrict(new Date(message.createdAt), {
                // addSuffix: true,
              })}
            </span>
            {isCurrentUser && (
              <>
                {message.readAt ? (
                  <CheckCheck className="h-4 w-4 text-blue-400" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
