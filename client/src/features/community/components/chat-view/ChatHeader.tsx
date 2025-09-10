'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import { MoreHorizontal, Phone, Users, Video } from 'lucide-react';
import { Conversation } from '../../types';

interface ChatHeaderProps {
  typingUser?: { name: string | null };
  conversation: Conversation | null;
}

export function ChatHeader({ conversation, typingUser }: ChatHeaderProps) {
  if (!conversation) return <ChatHeaderSkeleton />;

  const isGroup = conversation.type === 'group';
  const user = conversation.otherParticipant;
  const displayName = isGroup ? conversation.name : user?.name;

  return (
    <div className="flex items-center gap-3 border-b px-2">
      <div className="relative">
        <Avatar>
          <AvatarImage
            src={!isGroup ? user?.avatarUrl || undefined : undefined}
          />
          <AvatarFallback>
            {isGroup ? <Users className="h-5 w-5" /> : getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="">
        <p className="font-semibold">{displayName}</p>

        {typingUser ? (
          <span className="text-muted-foreground italic">Typing...</span>
        ) : (
          <span className="text-muted-foreground">
            {user?.status || 'Offline'}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Call</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Video Call</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More Options</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}
