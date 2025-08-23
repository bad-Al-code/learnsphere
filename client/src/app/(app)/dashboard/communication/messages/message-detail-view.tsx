'use client';

import { RichTextEditor } from '@/components/text-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import {
  Archive,
  CalendarClock,
  Download,
  File,
  Forward,
  Paperclip,
  Phone,
  Reply,
  Star,
  Video,
} from 'lucide-react';
import { Message } from './types';

interface MessageDetailViewProps {
  message: Message | null;
}

export function MessageDetailView({ message }: MessageDetailViewProps) {
  if (!message) {
    return (
      <div className="bg-background text-muted-foreground flex h-full flex-col items-center justify-center">
        <p>Select a message to read</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={message.sender.avatarUrl}
                alt={message.sender.name}
              />
              <AvatarFallback>
                {getInitials(message.sender.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{message.sender.name}</p>
              <p className="text-muted-foreground text-xs">
                {message.sender.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Call</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Video</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Reply className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reply</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Forward className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Forward</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator className="my-3" />
        <h2 className="text-xl font-semibold">{message.subject}</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Course: {message.course} • {message.timestamp}
        </p>
        <div className="mt-2 flex gap-2">
          {message.priority === 'normal' && (
            <Badge variant="outline">normal priority</Badge>
          )}
          {message.hasAttachment && (
            <Badge variant="secondary">
              <Paperclip className="mr-1 h-3 w-3" />
              Attachment
            </Badge>
          )}
        </div>
      </div>

      <div
        className="w-full flex-1 overflow-y-auto p-4"
        dangerouslySetInnerHTML={{ __html: message.body }}
      />

      {message.hasAttachment && (
        <div className="border-t p-4">
          <h4 className="mb-2 text-sm font-semibold">Attachments</h4>
          <div className="flex items-center justify-between gap-2 rounded-md border p-2">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5" />
              <span className="text-sm">assignment3_draft.pdf</span>
            </div>
            <Button variant="ghost" size="icon" title="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-background mt-auto border-t p-4">
        <RichTextEditor onChange={() => {}} />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archieve</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Important</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <CalendarClock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Schedule</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button>Send Reply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageDetailViewSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <Separator className="my-3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
      <div className="flex-1 space-y-3 p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <div className="bg-background mt-auto space-y-2 border-t p-4">
        <Skeleton className="h-24 w-full rounded-md border" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
