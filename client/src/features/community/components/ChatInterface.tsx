'use client';

import {
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useConversations } from '../hooks/userConversations';
import { Conversation } from '../types';

type TStatus = 'online' | 'offline' | 'away';
type TConversation = {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  status: TStatus;
  unreadCount?: number;
};
type TMessage = {
  id: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
};

const conversationData: TConversation[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    lastMessage: 'Thanks for the help with the assignment!',
    timestamp: '2m',
    status: 'online',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Prof. Johnson',
    lastMessage: 'Office hours tomorrow at 2 PM',
    timestamp: '2h',
    status: 'away',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    lastMessage: 'Want to study together?',
    timestamp: '3h',
    status: 'offline',
  },
  {
    id: '4',
    name: 'Study Group #1',
    lastMessage: 'Emma: See you all tomorrow',
    timestamp: '5h',
    status: 'online',
  },
  {
    id: '5',
    name: 'Lisa Park',
    lastMessage: 'Good luck on the exam!',
    timestamp: 'yesterday',
    status: 'offline',
  },
  {
    id: '6',
    name: 'David Kim',
    lastMessage: 'Can you send me the project files?',
    timestamp: '10m',
    status: 'online',
    unreadCount: 1,
  },
  {
    id: '7',
    name: 'Rachel Adams',
    lastMessage: 'Don’t forget the group presentation slides!',
    timestamp: '20m',
    status: 'away',
  },
  {
    id: '8',
    name: 'James Lee',
    lastMessage: 'See you at the library later?',
    timestamp: '35m',
    status: 'offline',
  },
  {
    id: '9',
    name: 'Maria Gonzalez',
    lastMessage: 'Just finished the practice test!',
    timestamp: '1h',
    status: 'online',
  },
  {
    id: '10',
    name: 'Study Group #2',
    lastMessage: 'Tom: Let’s divide the topics evenly',
    timestamp: '3h',
    status: 'online',
    unreadCount: 3,
  },
  {
    id: '11',
    name: 'Ethan Wright',
    lastMessage: 'I uploaded my notes to the drive',
    timestamp: '4h',
    status: 'away',
  },
  {
    id: '12',
    name: 'Olivia Brown',
    lastMessage: 'When is the assignment due again?',
    timestamp: '5h',
    status: 'offline',
  },
  {
    id: '13',
    name: 'Study Buddy - Alex',
    lastMessage: 'Let’s do flashcards tonight',
    timestamp: '6h',
    status: 'online',
  },
  {
    id: '14',
    name: 'Emma Wilson',
    lastMessage: 'Thanks for explaining SQL joins!',
    timestamp: 'yesterday',
    status: 'away',
  },
  {
    id: '15',
    name: 'Daniel Martinez',
    lastMessage: 'Good luck on your midterm!',
    timestamp: '2d',
    status: 'offline',
  },
].map(
  (c) =>
    ({
      ...c,
      initials: c.name
        .split(' ')
        .map((n) => n[0])
        .join(''),
    }) as TConversation
);

const chatHistory: TMessage[] = [
  {
    id: 'm1',
    text: "Hey! Did you understand the last part of today's lecture?",
    timestamp: '2:30 PM',
    isCurrentUser: false,
  },
  {
    id: 'm2',
    text: 'Which part specifically? The one about data structures?',
    timestamp: '2:32 PM',
    isCurrentUser: true,
  },
  {
    id: 'm3',
    text: "Yeah, the binary tree implementation. I'm having trouble with the recursive functions.",
    timestamp: '2:33 PM',
    isCurrentUser: false,
  },
  {
    id: 'm4',
    text: 'Oh I see! Let me share my notes with you. The key is understanding the base case first.',
    timestamp: '2:35 PM',
    isCurrentUser: true,
  },
  {
    id: 'm5',
    text: 'That would be amazing! Thanks so much 🙏',
    timestamp: '2:36 PM',
    isCurrentUser: false,
  },
  {
    id: 'm6',
    text: "No problem! We're all in this together. Want to hop on a quick call to go through it?",
    timestamp: '2:37 PM',
    isCurrentUser: true,
  },
  {
    id: 'm7',
    text: 'Yes please! That would help so much',
    timestamp: '2:38 PM',
    isCurrentUser: false,
  },
  {
    id: 'm8',
    text: 'Cool, sending you the link now.',
    timestamp: '2:39 PM',
    isCurrentUser: true,
  },
  {
    id: 'm9',
    text: 'Got it, joining!',
    timestamp: '2:40 PM',
    isCurrentUser: false,
  },
  {
    id: 'm10',
    text: 'Can you walk me through that recursion step again?',
    timestamp: '2:42 PM',
    isCurrentUser: false,
  },
  {
    id: 'm11',
    text: 'Sure! Think of it like peeling layers of an onion — each call handles one layer.',
    timestamp: '2:44 PM',
    isCurrentUser: true,
  },
  {
    id: 'm12',
    text: 'Ahhh okay, that makes a lot more sense now!',
    timestamp: '2:45 PM',
    isCurrentUser: false,
  },
  {
    id: 'm13',
    text: 'Exactly! And don’t forget to always check the base case.',
    timestamp: '2:47 PM',
    isCurrentUser: true,
  },
  {
    id: 'm14',
    text: 'Right, otherwise it just keeps looping forever 😅',
    timestamp: '2:48 PM',
    isCurrentUser: false,
  },
  {
    id: 'm15',
    text: 'Haha yep! You’re getting it 👍',
    timestamp: '2:49 PM',
    isCurrentUser: true,
  },
  {
    id: 'm16',
    text: 'Thanks again, this really helps!',
    timestamp: '2:50 PM',
    isCurrentUser: false,
  },
  {
    id: 'm17',
    text: 'No worries at all. We’ll ace this exam together 💪',
    timestamp: '2:52 PM',
    isCurrentUser: true,
  },
];

const selectedConversation = conversationData[0];

function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversations: Conversation) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Direct Messages</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={cn(
                'hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2',
                convo.id === selectedId && 'bg-muted hover:bg-muted'
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback>{convo.initials}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2',
                    convo.status === 'online'
                      ? 'bg-emerald-500'
                      : convo.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                  )}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold">{convo.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {convo.lastMessage}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">
                  {convo.timestamp}
                </p>
                {convo.unreadCount && (
                  <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                    {convo.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatView({ user, messages }: { user: any; messages: TMessage[] }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-3">
        <Avatar>
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-muted-foreground text-xs">{user.status}</p>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2',
                msg.isCurrentUser && 'justify-end'
              )}
            >
              {!msg.isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-2 text-sm',
                  msg.isCurrentUser
                    ? 'from-secondary/50 to-secondary text-primary bg-gradient-to-r'
                    : 'from-secondary/50 to-secondary bg-gradient-to-r'
                )}
              >
                <p>{msg.text}</p>
                <p
                  className={cn(
                    'mt-1 text-xs',
                    msg.isCurrentUser
                      ? 'text-primary/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-2">
        <div className="relative">
          <Input
            placeholder={`Message ${user.name}...`}
            className="h-12 border-0 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="default">
              <Send className="-ml-1 h-4 w-4 rotate-45" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatViewSkeleton() {
  return (
    <div className="flex h-full flex-col">
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
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-16 w-48 rounded-lg" />
        </div>
        <div className="flex items-end justify-end gap-2">
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-20 w-56 rounded-lg" />
        </div>
        <div className="flex items-end justify-end gap-2">
          <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ChatInterface() {
  const { data: conversations, isLoading, isError } = useConversations();
  const selectedConversation = conversations?.[0];

  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pt-2 pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={0} maxSize={100}>
          {isLoading ? (
            <ConversationListSkeleton />
          ) : (
            <ConversationList
              conversations={conversations || []}
              selectedId={selectedConversation?.id || null}
              onSelect={() => {}}
            />
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          {selectedConversation ? (
            <ChatView
              user={selectedConversation.otherParticipant}
              messages={chatHistory}
            />
          ) : (
            <ChatViewSkeleton />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}

export function ChatInterfaceSkeleton() {
  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={25} maxSize={100}>
          <ConversationListSkeleton />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ChatViewSkeleton />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
