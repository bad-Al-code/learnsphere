'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useState } from 'react';
import {
  MessageDetailView,
  MessageDetailViewSkeleton,
} from './message-detail-view';
import { MessageSidebar, MessageSidebarSkeleton } from './message-sidebar';
import { Message } from './types';

const messages: Message[] = [
  {
    id: 1,
    sender: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      avatarUrl: 'https://i.pravatar.cc/40?u=sarah',
    },
    subject: 'Question about Assignment 3',
    snippet: "I'm having trouble with the data visualization part...",
    body: "<h3>Hi Professor,</h3><p>I'm having trouble with the data visualization part of Assignment 3. Could you please provide some guidance on which library would be best for creating interactive charts?</p><p>Thanks,</p><p>Sarah</p>",
    course: 'Data Science',
    priority: 'normal',
    timestamp: '2 hours ago',
    isRead: false,
    hasAttachment: true,
  },
  {
    id: 2,
    sender: {
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      avatarUrl: 'https://i.pravatar.cc/40?u=michael',
    },
    subject: 'Request for Extension',
    snippet: 'Dear Professor, I would like to request a...',
    body: '<p>Request content here...</p>',
    course: 'Web Development',
    priority: 'high',
    timestamp: '5 hours ago',
    isRead: false,
    hasAttachment: false,
  },
  {
    id: 3,
    sender: { name: 'Emma Thompson', email: 'emma.t@email.com' },
    subject: 'Thank you for the feedback',
    snippet: 'Thank you so much for the detailed feedback...',
    body: '<p>Feedback appreciation here...</p>',
    course: 'Digital Marketing',
    priority: 'normal',
    timestamp: '1 day ago',
    isRead: true,
    hasAttachment: false,
  },
  {
    id: 4,
    sender: { name: 'David Kim', email: 'david.kim@email.com' },
    subject: 'Course Material Access Issue',
    snippet: "I'm unable to access the video lectures...",
    body: '<p>Access issue details here...</p>',
    course: 'Graphic Design',
    priority: 'high',
    timestamp: '2 days ago',
    isRead: true,
    hasAttachment: false,
  },
];

export function MessagesPage() {
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    messages[0]?.id ?? null
  );

  const selectedMessage =
    messages.find((m) => m.id === selectedMessageId) || null;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-10rem)] max-h-[800px] min-h-[500px] w-full items-stretch rounded-lg border"
    >
      <ResizablePanel defaultSize={30} minSize={25}>
        <MessageSidebar
          messages={messages}
          selectedMessageId={selectedMessageId}
          onSelectMessage={setSelectedMessageId}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <MessageDetailView message={selectedMessage} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function MessagesPageSkeleton() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-10rem)] max-h-[800px] min-h-[500px] w-full items-stretch rounded-lg border"
    >
      <ResizablePanel defaultSize={30} minSize={25}>
        <MessageSidebarSkeleton />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <MessageDetailViewSkeleton />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
