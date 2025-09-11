'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Check,
  CheckCheck,
  Download,
  File,
  Reply,
  SmilePlus,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { parseMessageContent } from '../../lib/utils';
import { Conversation, MediaAttachment, Message } from '../../types';
import { ReactionPicker } from './ReactionPicker';

const FileAttachment = ({ attachment }: { attachment: MediaAttachment }) => (
  <Link
    href={attachment.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 rounded-md bg-black/10 p-2 transition-colors hover:bg-black/20"
  >
    <div className="bg-background/50 flex h-10 w-10 items-center justify-center rounded-md">
      <File className="h-6 w-6" />
    </div>

    <div className="flex-1">
      <p className="font-semibold">{attachment.name}</p>
      <p className="text-xs opacity-80">{attachment.mimeType}</p>
    </div>

    <Download className="h-5 w-5 flex-shrink-0" />
  </Link>
);

interface MessageItemProps {
  message: Message;
  conversationType: Conversation['type'];
  onSetReply: (message: Message) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageItem({
  message,
  conversationType,
  onSetReply,
  onReaction,
}: MessageItemProps) {
  const currentUser = useSessionStore((state) => state.user);
  const isCurrentUser = message.senderId === currentUser?.userId;
  const showSenderInfo = conversationType === 'group' && !isCurrentUser;

  const { isMedia, data: contentData } = parseMessageContent(message.content);
  const reactions = message.reactions
    ? Object.entries(message.reactions).filter(
        ([, userIds]) => userIds.length > 0
      )
    : [];

  return (
    <div
      className={cn(
        'group flex w-full items-start gap-2',
        isCurrentUser && 'justify-end'
      )}
    >
      {!isCurrentUser && (
        <div className="flex flex-shrink-0 items-center self-start">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender?.avatarUrl || undefined} />
            <AvatarFallback>{getInitials(message.sender?.name)}</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          'flex items-center gap-2',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
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
              'max-w-md rounded-lg text-sm',
              !isMedia && 'px-3 py-2',
              isCurrentUser
                ? 'from-secondary to-muted text-foreground rounded-br-none bg-gradient-to-r'
                : 'from-secondary to-muted rounded-bl-none bg-gradient-to-l'
            )}
          >
            {message.replyingTo && (
              <div className="bg-background border-muted-foreground/30 mb-1 rounded-md border p-2 text-xs">
                <p className="font-semibold">
                  {message.replyingTo.sender?.name || 'User'}
                </p>
                <p className="line-clamp-2 opacity-80">
                  {message.replyingTo.content}
                </p>
              </div>
            )}

            {isMedia ? (
              <div>
                {(contentData as MediaAttachment).type === 'image' ? (
                  <Image
                    src={(contentData as MediaAttachment).url}
                    alt={(contentData as MediaAttachment).name}
                    width={250}
                    height={250}
                    className="max-h-[300px] w-full rounded-md object-cover"
                  />
                ) : (
                  <FileAttachment attachment={contentData as MediaAttachment} />
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{contentData as string}</p>
            )}

            <div className="mt-1 flex items-center justify-end gap-1.5 text-xs opacity-80">
              <span>
                {formatDistanceToNowStrict(new Date(message.createdAt), {
                  addSuffix: true,
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

        {/* --- Reaction + Reply Controls --- */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {isCurrentUser ? (
            <>
              {/* Smile first */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <SmilePlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
                  <ReactionPicker
                    onSelect={(emoji) => onReaction(message.id, emoji)}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onSetReply(message)}
              >
                <Reply className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {/* Reply first */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onSetReply(message)}
              >
                <Reply className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <SmilePlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
                  <ReactionPicker
                    onSelect={(emoji) => onReaction(message.id, emoji)}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>

        {reactions.length > 0 && (
          <div className="mt-1 flex items-center gap-1">
            {reactions.map(([emoji, userIds]) => (
              <Badge
                key={emoji}
                variant="secondary"
                className="cursor-pointer gap-1 pr-2"
              >
                <span>{emoji}</span>
                <span>{userIds.length}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
