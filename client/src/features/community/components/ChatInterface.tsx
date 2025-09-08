'use client';

import {
  Mic,
  MoreHorizontal,
  Phone,
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
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessage';
import { Conversation, Message } from '../types';
import { NewConversationDialog } from './NewConversationDialog';

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

function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onConversationCreated,
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversations: Conversation) => void;
  onConversationCreated: (newConversation: Conversation) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Direct Messages</h2>
          <NewConversationDialog onConversationCreated={() => {}} />
        </div>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((convo) => {
            const displayName =
              convo.otherParticipant?.name || convo.name || 'Conversation';

            const initials = getInitials(displayName);

            const formattedTimestamp = convo.lastMessageTimestamp
              ? formatDistanceToNowStrict(
                  new Date(convo.lastMessageTimestamp),
                  { addSuffix: true }
                )
              : '';

            return (
              <div
                key={convo.id}
                onClick={() => onSelect(convo)}
                className={cn(
                  'hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2',
                  convo.id === selectedId && 'bg-muted hover:bg-muted'
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-semibold">{displayName}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {convo.lastMessage || 'No messages yet'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-muted-foreground text-xs whitespace-nowrap">
                    {formattedTimestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChatView({
  user,
  messages,
  sendMessage,
}: {
  user: Conversation['otherParticipant'];
  messages: Message[];
  sendMessage: (content: string) => void;
}) {
  const currentUser = useSessionStore((state) => state.user);

  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (messageContent.trim()) {
      sendMessage(messageContent);
      setMessageContent('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return <ChatViewSkeleton />;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-3">
        <Avatar>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-semibold">{user.name}</p>
          {/* <p className="text-muted-foreground text-xs">{user.status}</p> */}
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
                msg.senderId === currentUser?.userId && 'justify-end'
              )}
            >
              {msg.senderId !== currentUser?.userId && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(msg.sender?.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-2 text-sm',
                  msg.senderId === currentUser?.userId
                    ? 'from-secondary/50 to-secondary text-primary bg-gradient-to-r'
                    : 'from-secondary/50 to-secondary bg-gradient-to-r'
                )}
              >
                <p>{msg.content}</p>
                <p
                  className={cn(
                    'mt-1 text-end text-xs',
                    msg.senderId ? 'text-primary/70' : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNowStrict(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-2">
        <div className="relative">
          <Input
            placeholder={`Message ${user.name}...`}
            className="h-12 border-0 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="default" onClick={handleSend}>
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
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    isError,
  } = useConversations();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const { sendMessage } = useChatWebSocket();

  // useEffect(() => {
  //   if (conversations && conversations.length > 0 && !selectedConversation) {
  //     setSelectedConversation(conversations[0]);
  //   }
  // }, [conversations, selectedConversation]);

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    selectedConversation?.id || null
  );

  const messages = messagesData?.pages.flat().reverse() || [];

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      sendMessage({
        conversationId: selectedConversation.id,
        content: content,
      });
    }
  };

  const handleConversationCreated = (newConversation: Conversation) => {
    setSelectedConversation(newConversation);
  };

  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pt-2 pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={0} maxSize={100}>
          {isLoadingConversations ? (
            <ConversationListSkeleton />
          ) : isError ? (
            <p className="text-destructive p-4">
              Failed to load conversations.
            </p>
          ) : (
            <ConversationList
              conversations={conversations || []}
              selectedId={selectedConversation?.id || null}
              onSelect={setSelectedConversation}
              onConversationCreated={handleConversationCreated}
            />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          {isLoadingMessages && !messages.length ? (
            <ChatViewSkeleton />
          ) : selectedConversation ? (
            <ChatView
              user={selectedConversation.otherParticipant}
              messages={messages}
              sendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Select a conversation</p>
            </div>
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
