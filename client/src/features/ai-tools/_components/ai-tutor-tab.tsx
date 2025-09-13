'use client';

import {
  ArrowUp,
  Bot,
  PanelLeftClose,
  PanelRightClose,
  Plus,
} from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { ChatMessage } from '../types/inedx';

export function ConversationSidebar() {
  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex items-center justify-between p-2">
        <h2 className="text-lg font-semibold">Chats</h2>

        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
            <TooltipContent>New Chat</TooltipContent>
          </TooltipTrigger>
        </Tooltip>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <p className="text-muted-foreground text-sm">
          Conversation list will appear here.
        </p>
      </div>
    </div>
  );
}

const COURSE_ID = '8bc1e072-e11a-40d4-b436-e713b0921433';

function AiStudyAssistant() {
  // const { user } = useSessionStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useAiTutorChat();

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);

    sendMessage(
      { courseId: COURSE_ID, prompt },
      {
        onSuccess: (data) => {
          if (data.data) {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'model',
                content: data.data?.response!,
              },
            ]);
          }
          if (data.error) {
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: 'system', content: data.error! },
            ]);
          }
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: 'system', content: error.message },
          ]);
        },
      }
    );

    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <Card className="flex h-[calc(100vh-12.5rem)] flex-col pb-0">
      <CardHeader className="">
        <div className="gapa-2 flex items-center">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Study Assistant</CardTitle>
        </div>

        <CardDescription>
          Ask anything about your course content.
        </CardDescription>
      </CardHeader>

      <CardContent
        ref={chatContainerRef}
        className="flex-1 space-y-4 overflow-y-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-start gap-3',
              msg.role === 'user' && 'justify-end'
            )}
          >
            {/* {msg.role === 'model' && (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )} */}

            <div className="max-w-md space-y-1">
              <div
                className={cn(
                  'prose dark:prose-invert prose-p:my-0 prose-ul:my-0 prose-li:my-0 rounded-lg p-3 text-sm whitespace-pre-wrap',
                  msg.role === 'user' ? 'bg-muted' : 'bg-muted',
                  msg.role === 'system' && 'bg-destructive/10 text-destructive'
                )}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>

            {/* {msg.role === 'user' && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={user?.avatarUrls?.small}
                  alt={user?.firstName || 'User'}
                />
                <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
              </Avatar>
            )} */}
          </div>
        ))}

        {isPending && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="bg-muted max-w-xs rounded-lg p-3">
              <div className="flex space-x-2">
                <span className="bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                <span className="bg-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                <span className="bg-foreground h-2 w-2 animate-bounce rounded-full" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardContent className="p-1">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question... (Shift+Enter for new line)"
            className="max-h-48 min-h-[44px] resize-none py-2 pr-12 leading-relaxed"
            disabled={isPending}
            rows={1}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-1 h-9 w-9 rounded-full"
                disabled={isPending || !prompt.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Message</TooltipContent>
          </Tooltip>
        </form>
      </CardContent>
    </Card>
  );
}

export function AiTutorTab() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<ImperativePanelHandle>(null);

  const toggleCollapse = () => {
    if (!panelRef.current) return;

    if (isCollapsed) {
      panelRef.current.expand();
    } else {
      panelRef.current.collapse();
    }

    setIsCollapsed((prev) => !prev);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-12.5rem)] rounded-lg border"
      onLayout={(sizes) => {
        if (sizes[0] < 5) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }}
    >
      <ResizablePanel
        ref={panelRef}
        collapsible
        collapsedSize={0}
        minSize={15}
        defaultSize={25}
        className={cn(
          isCollapsed && 'min-w-[40px] transition-all duration-300 ease-in-out'
        )}
      >
        <div className="relative h-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 z-10 h-7 w-7"
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? 'Expand' : 'Collapse'}</p>
            </TooltipContent>
          </Tooltip>

          {!isCollapsed && <ConversationSidebar />}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={75}>
        <AiStudyAssistant />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function AiTutorTabSkeleton() {
  return (
    <div className="flex h-[calc(100vh-12.5rem)] rounded-lg border">
      <div className="w-[25%] p-2">
        <ConversationSidebarSkeleton />
      </div>
      <div className="w-[75%] border-l">
        <AiStudyAssistantSkeleton />
      </div>
    </div>
  );
}

export function ConversationSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex items-center justify-between p-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function AiStudyAssistantSkeleton() {
  return (
    <Card className="flex h-full flex-col border-none shadow-none">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-20 max-w-md flex-1 rounded-lg" />
        </div>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-16 max-w-sm flex-1 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
      <CardContent className="border-t pt-4">
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}
