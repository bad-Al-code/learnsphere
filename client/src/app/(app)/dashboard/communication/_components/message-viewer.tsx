'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import {
  Archive,
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Forward,
  Image as ImageIcon,
  Link as LinkIcon,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Paperclip,
  Phone,
  Reply,
  Send,
  Smile,
  Star,
  Video,
} from 'lucide-react';
import type { Message } from './message-list-item';

interface MessageViewerProps {
  message: Message;
  onBack: () => void;
}

export function MessageViewer({ message, onBack }: MessageViewerProps) {
  return (
    <div className="flex h-full flex-col">
      <MessageHeader message={message} onBack={onBack} />
      <MessageBody message={message} />
      <MessageReply />
    </div>
  );
}

function MessageHeader({
  message,
  onBack,
}: {
  message: Message;
  onBack: () => void;
}) {
  return (
    <div className="flex-shrink-0 border-b p-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src={message.avatarUrl} />
            <AvatarFallback>{getInitials(message.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold">{message.subject}</h2>
            <p className="text-muted-foreground text-sm">
              From: {message.name} ({message.email})
            </p>
            <p className="text-muted-foreground text-xs">
              Course: {message.course} • {message.timestamp}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Video className="h-4 w-4" />
            Video
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="More Options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="md:hidden">
                <Phone className="h-4 w-4" /> Call
              </DropdownMenuItem>
              <DropdownMenuItem className="md:hidden">
                <Video className="h-4 w-4" /> Video
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add to tasks</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function MessageBody({ message }: { message: Message }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="not-prose mb-4 flex items-center gap-2">
          <Badge variant="outline">normal priority</Badge>
          <Badge variant="outline">
            <Paperclip className="mr-1 h-3 w-3" />
            Attachment
          </Badge>
        </div>
        <p>Hi Professor,</p>
        <p>
          I'm having trouble with the data visualization part of Assignment 3.
          Could you please provide some guidance on which library would be best
          for creating interactive charts?
        </p>
        <p>
          Thanks,
          <br />
          Sarah
        </p>
        <Separator className="my-6" />
        <div>
          <p className="not-prose text-sm font-semibold">Attachments:</p>
          <div className="not-prose mt-2 flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-5 w-5" />
              <span className="cursor-pointer text-sm text-blue-500 hover:underline">
                assignment3_draft.pdf
              </span>
            </div>
            <Button variant="ghost" size="icon" title="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageReply() {
  return (
    <div className="bg-background flex-shrink-0 border-t p-4">
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Textarea placeholder="Type your reply..." className="max-h-64" />
          <Button title="Send Reply">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <TooltipProvider>
            <div className="mr-auto flex items-center gap-1">
              <Select defaultValue="none">
                <SelectTrigger className="h-9 w-auto text-xs">
                  <SelectValue placeholder="Quick templates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Quick templates</SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert image</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Record audio</TooltipContent>
              </Tooltip>
            </div>
            <div className="hidden items-center gap-2 pr-2 md:flex">
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4" />
                Archive
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4" />
                Star
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Archive className="h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4" />
                  Star
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4" />
                  Schedule
                </DropdownMenuItem>
                <DropdownMenuItem>Save Draft</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function MessageViewerSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Separator />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
      <div className="flex-shrink-0 border-t p-4">
        <Skeleton className="h-[120px] w-full" />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
