'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Filter, Inbox, Search } from 'lucide-react';
import { useState } from 'react';

import type { Message } from './message-list-item';
import { MessageListItem, MessageListItemSkeleton } from './message-list-item';
import { MessageViewer, MessageViewerSkeleton } from './message-viewer';

const messages: Message[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    subject: 'Question about Assignment 3',
    preview: "Hi Professor, I'm having trouble with the ...",
    course: 'Data Science',
    timestamp: '2 hours ago',
    isRead: false,
    hasAttachment: true,
    priority: 'High',
    avatarUrl: 'https://picsum.photos/seed/sarah/40/40',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    subject: 'Request for Extension',
    preview: 'Dear Professor, I would like to request a ...',
    course: 'Web Development',
    timestamp: '5 hours ago',
    isRead: true,
    hasAttachment: false,
    priority: 'High',
    avatarUrl: 'https://picsum.photos/seed/michael/40/40',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.t@email.com',
    subject: 'Thank you for the feedback',
    preview: 'Thank you so much for the detailed feed...',
    course: 'Digital Marketing',
    timestamp: '1 day ago',
    isRead: true,
    hasAttachment: false,
    priority: 'Normal',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    subject: 'Course Material Access Issue',
    preview: "I'm unable to access the video lectures f...",
    course: 'Graphic Design',
    timestamp: '2 days ago',
    isRead: true,
    hasAttachment: false,
    priority: 'High',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.w@email.com',
    subject: 'Quick question about the syllabus',
    preview: 'Just wanted to clarify a point regarding...',
    course: 'Data Science',
    timestamp: '3 days ago',
    isRead: true,
    hasAttachment: false,
    priority: 'Normal',
  },
];

export default function CommunicationPage() {
  const [selectedMessageId, setSelectedMessageId] = useState('1');
  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  return (
    <div className="flex h-screen flex-col">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]">
        <aside
          className={`flex flex-col border-r ${
            selectedMessageId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="flex-shrink-0 border-b p-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input placeholder="Search messages..." className="pl-8" />
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="hidden w-auto md:flex">
                  <SelectValue placeholder="All Messages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Inbox className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter messages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>More Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 md:hidden">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Messages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="ds">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {messages.map((msg) => (
              <div key={msg.id} onClick={() => setSelectedMessageId(msg.id)}>
                <MessageListItem
                  message={msg}
                  isSelected={selectedMessageId === msg.id}
                />
              </div>
            ))}
          </div>
        </aside>

        <main
          className={`flex flex-col ${
            !selectedMessageId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {selectedMessage ? (
            <MessageViewer
              message={selectedMessage}
              onBack={() => setSelectedMessageId('')}
            />
          ) : (
            <div className="text-muted-foreground hidden h-full items-center justify-center lg:flex">
              Select a message to view
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function CommunicationPageSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]">
        <aside className="hidden flex-col border-r lg:flex">
          <div className="flex-shrink-0 border-b p-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <MessageListItemSkeleton key={i} />
            ))}
          </div>
        </aside>
        <main className="flex flex-col">
          <MessageViewerSkeleton />
        </main>
      </div>
    </div>
  );
}
