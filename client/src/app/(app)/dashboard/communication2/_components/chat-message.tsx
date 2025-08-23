'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy,
  CornerUpLeft,
  MoreHorizontal,
  Pin,
  Smile,
  Trash2,
} from 'lucide-react';
import { UserAvatar, UserAvatarSkeleton } from './user-avatar';

export interface MessageData {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
  content: string;
  isEdited?: boolean;
}

interface ChatMessageProps {
  message: MessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="group hover:bg-muted/50 relative flex items-start gap-3 rounded-lg p-2 transition-colors md:gap-4 md:p-4">
      <UserAvatar
        name={message.author.name}
        imageUrl={message.author.avatarUrl}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="font-semibold break-all">{message.author.name}</p>
          <p className="text-muted-foreground/50 flex-shrink-0 text-xs">
            {message.timestamp}
          </p>
        </div>
        <p className="text-foreground break-words">{message.content}</p>
        {message.isEdited && (
          <span className="text-muted-foreground text-xs">(edited)</span>
        )}
      </div>

      <div className="bg-background absolute top-2 right-2 flex items-center gap-1 rounded-md border p-1 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-6 w-6 md:inline-flex"
        >
          <Smile className="text-muted-foreground h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="md:hidden">
              <Smile className="h-4 w-4" />
              <span>Add Reaction</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CornerUpLeft className="h-4 w-4" />
              <span>Reply</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4" />
              <span>Copy Text</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin className="h-4 w-4" />
              <span>Pin Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive hover:!text-destructive">
              <Trash2 className="text-destructive h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="s flex items-start gap-3 p-2 md:gap-4 md:p-4">
      <UserAvatarSkeleton size="md" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
