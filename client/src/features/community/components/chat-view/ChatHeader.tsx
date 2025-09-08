'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, getInitials } from '@/lib/utils';
import { MoreHorizontal, Phone, Video } from 'lucide-react';
import { Conversation } from '../../types';

interface ChatHeaderProps {
  user: Conversation['otherParticipant'];
}

export function ChatHeader({ user }: ChatHeaderProps) {
  if (!user) return <ChatHeaderSkeleton />;

  return (
    <div className="flex items-center gap-3 border-b p-3">
      <div className="relative">
        <Avatar>
          <AvatarImage src={user?.avatarUrl || undefined} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        {user?.status && (
          <span
            className={cn(
              'border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2',
              user.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
            )}
          />
        )}
      </div>
      <div>
        <p className="font-semibold">{user.name}</p>
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
