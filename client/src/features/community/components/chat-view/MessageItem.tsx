'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { formatDistanceToNowStrict } from 'date-fns';
import { Check, CheckCheck, Download, File, Reply } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { parseMessageContent } from '../../lib/utils';
import { Conversation, MediaAttachment, Message } from '../../types';

interface MessageItemProps {
  message: Message;
  conversationType: Conversation['type'];
  onSetReply: (message: Message) => void;
}

export function MessageItem({
  message,
  conversationType,
  onSetReply,
}: MessageItemProps) {
  const currentUser = useSessionStore((state) => state.user);
  const isCurrentUser = message.senderId === currentUser?.userId;
  const showSenderInfo = conversationType === 'group' && !isCurrentUser;
  const [isHovered, setIsHovered] = useState(false);

  const { isMedia, data: contentData } = parseMessageContent(message.content);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-start gap-2',
        isCurrentUser && 'justify-end'
      )}
    >
      {isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-0 right-10 h-6 w-6',
            isCurrentUser ? 'left-[-30px]' : 'right-[-30px]'
          )}
          onClick={() => onSetReply(message)}
        >
          <Reply className="h-4 w-4" />
        </Button>
      )}

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
            'max-w-xs rounded-lg text-sm',
            !(isMedia && (contentData as MediaAttachment).type === 'image') &&
              'rounded-lg p-2',
            isCurrentUser
              ? 'from-secondary/50 to-secondary text-primary bg-gradient-to-r'
              : 'from-secondary/50 to-secondary bg-gradient-to-r'
          )}
        >
          {message.replyingTo && (
            <div className="mb-1 rounded-md bg-black/10 p-2 text-xs">
              <p className="font-semibold">
                {message.replyingTo.sender?.name || 'User'}
              </p>

              <p className="text-muted-foreground/80 line-clamp-2">
                {message.replyingTo.content}
              </p>
            </div>
          )}

          {isMedia ? (
            (contentData as MediaAttachment).type === 'image' ? (
              <Image
                src={(contentData as MediaAttachment).url}
                alt={(contentData as MediaAttachment).name}
                width={250}
                height={250}
                className="max-h-[300px] w-full rounded-md object-cover"
              />
            ) : (
              <FileAttachment attachment={contentData as MediaAttachment} />
            )
          ) : (
            <p>{contentData as string}</p>
          )}

          <div
            className={cn(
              'text-muted-foreground/80 mt-1 flex items-center justify-end gap-1.5 text-xs',
              isMedia && 'p-1'
            )}
          >
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

export const FileAttachment = ({
  attachment,
}: {
  attachment: MediaAttachment;
}) => (
  <Link
    href={attachment.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
  >
    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-md">
      <File className="h-6 w-6" />
    </div>

    <div className="flex-1">
      <p className="font-semibold">{attachment.name}</p>
      <p className="text-muted-foreground text-xs">{attachment.mimeType}</p>
    </div>

    <Download className="h-5 w-5 flex-shrink-0" />
  </Link>
);
