'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Message } from './types';

interface MessageSidebarProps {
  messages: Message[];
  selectedMessageId: number | null;
  onSelectMessage: (id: number) => void;
}

export function MessageSidebar({
  messages,
  selectedMessageId,
  onSelectMessage,
}: MessageSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-background sticky top-0 z-10 border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input placeholder="Search messages..." className="pl-8" />
        </div>
        <div className="mt-4 flex gap-2">
          <Select defaultValue="all-messages">
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filter messages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-messages">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {messages.map((message) => (
            <button
              key={message.id}
              onClick={() => onSelectMessage(message.id)}
              className={cn(
                'hover:bg-accent flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                selectedMessageId === message.id && 'bg-muted'
              )}
            >
              <div className="flex w-full items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={message.sender.avatarUrl}
                      alt={message.sender.name}
                    />
                    <AvatarFallback>
                      {getInitials(message.sender.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">{message.sender.name}</div>
                </div>

                {!message.isRead && (
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>

              <div className="line-clamp-1 text-xs font-medium">
                {message.subject}
              </div>

              <div className="text-muted-foreground line-clamp-1 text-xs">
                {message.snippet}
              </div>

              <div className="text-muted-foreground flex w-full items-center justify-between gap-2 text-xs">
                <Badge variant="outline" className="hidden sm:inline-block">
                  {message.course}
                </Badge>

                {message.priority === 'high' && (
                  <Badge variant="destructive">High</Badge>
                )}

                <span>{message.timestamp}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function MessageSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-background sticky top-0 z-10 border-b p-4">
        <Skeleton className="h-10 w-full" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-2 rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-1 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
