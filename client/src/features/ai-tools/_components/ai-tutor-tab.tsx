'use client';

import {
  ArrowUp,
  Bot,
  MoreHorizontal,
  PanelLeftClose,
  PanelRightClose,
  Plus,
} from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { toast } from 'sonner';
import {
  useCreateConversation,
  useDeleteConversation,
  useGetConversations,
  useRenameConversation,
} from '../hooks/useAiConversations';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { Conversation } from '../schemas/chat.schema';
import { ChatMessage } from '../types/inedx';

function RenameConversationDialog({
  conversation,
}: {
  conversation: Conversation;
}) {
  const [title, setTitle] = useState(conversation.title);
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: rename, isPending } = useRenameConversation();

  const handleRename = () => {
    if (!title.trim() || title === conversation.title) {
      setIsOpen(false);
      return;
    }
    rename(
      { conversationId: conversation.id, title },
      {
        onSuccess: () => {
          toast.success('Conversation renamed.');
          setIsOpen(false);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="title">New Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleRename} disabled={isPending}>
            {isPending ? 'Renaming...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConversationSidebar({
  isCollapsed,
  onToggle,
  activeConversationId,
  setActiveConversationId,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}) {
  const { data: conversations, isLoading } = useGetConversations();
  const { mutate: createConversation } = useCreateConversation();
  const { mutate: deleteConversation } = useDeleteConversation();

  const handleNewChat = () => {
    createConversation(
      { courseId: COURSE_ID },
      {
        onSuccess: (result) => {
          if (result.data) {
            setActiveConversationId(result.data.id);
            toast.success('New chat created.');
          } else if (result.error) {
            toast.error(result.error);
          }
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteConversation(id, {
        onSuccess: () => {
          if (activeConversationId === id) {
            setActiveConversationId(null);
          }
          toast.success('Chat deleted.');
        },
        onError: (error) => toast.error(error.message),
      });
    }
  };

  if (isLoading) {
    return <ConversationSidebarSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Chats</h2>
          </div>
        )}

        <div
          className={cn(
            'flex items-center gap-1',
            isCollapsed && 'w-full justify-center'
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={onToggle}>
                {isCollapsed ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? 'Expand' : 'Collapse'}
            </TooltipContent>
          </Tooltip>

          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={ handleNewChat }>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!isCollapsed ? (
          <div className="flex flex-col gap-1">
            {conversations?.map((convo) => (
              <Button
                key={convo.id}
                variant={
                  activeConversationId === convo.id ? 'secondary' : 'ghost'
                }
                className="h-auto w-full justify-between gap-2 px-2 py-1.5"
                onClick={() => setActiveConversationId(convo.id)}
              >
                <span className="truncate text-sm">{convo.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <RenameConversationDialog conversation={convo} />
                    <DropdownMenuItem
                      onClick={() => handleDelete(convo.id)}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Button>
            ))}
            {conversations?.length === 0 && (
              <p className="text-muted-foreground p-2 text-center text-sm">
                No chats yet.
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Chat</TooltipContent>
            </Tooltip>
          </div>
        )}
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
    <Card className="flex h-[calc(100vh-12.5rem)] flex-col border-0 pb-0">
      {/* <CardHeader className="">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Study Assistant</CardTitle>
        </div>

        <CardDescription>
          Ask anything about your course content.
        </CardDescription>
      </CardHeader> */}

      <CardContent
        ref={chatContainerRef}
        className="flex-1 space-y-4 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="animate-in fade-in-0 zoom-in-95 flex h-full items-center justify-center duration-500">
            <div className="max-w-md space-y-4 text-center">
              <div className="relative mx-auto h-16 w-16">
                <Bot className="text-primary/60 h-16 w-16 animate-pulse" />
                <div className="from-primary/20 absolute inset-0 animate-spin rounded-full bg-gradient-to-r to-transparent" />
              </div>
              <h3 className="text-muted-foreground text-lg font-semibold">
                Ready to help you learn!
              </h3>
              <p className="text-muted-foreground/80 text-sm">
                Ask me questions about your course content, request
                explanations, or get study tips.
              </p>
            </div>
          </div>
        )}

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

            <div className="max-w-[80%] space-y-1">
              <div
                className={cn(
                  'prose dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 rounded-2xl border p-4 text-sm whitespace-pre-wrap transition-all duration-200 hover:shadow-sm',
                  msg.role === 'user'
                    ? 'border-border/50 prose-invert" shadow-sm'
                    : msg.role === 'system'
                      ? 'from-destructive/10 to-destructive/5 text-destructive border-destructive/20 bg-gradient-to-br'
                      : 'border-border/50 hover:border-border'
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
          <div className="animate-in fade-in-0 slide-in-from-left-2 flex items-start gap-3 duration-300">
            <Avatar className="border-primary/20 h-8 w-8 border-2 shadow-sm">
              <AvatarFallback className="from-primary/10 to-primary/5 bg-gradient-to-br">
                <Bot className="text-primary h-4 w-4 animate-pulse" />
              </AvatarFallback>
            </Avatar>

            <div className="border-border/50 max-w-xs rounded-2xl border p-3 shadow-sm">
              <div className="flex space-x-2">
                <span className="bg-primary/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                <span className="bg-primary/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                <span className="bg-primary/60 h-2 w-2 animate-bounce rounded-full" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardContent className="border-border/50 bg-background/50 p-2 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              'bg-background/80 relative flex items-end gap-3 rounded-2xl border p-3 shadow-sm backdrop-blur-sm transition-all duration-300',
              'hover:border-primary/30 hover:shadow-md',
              isPending && 'border-primary/40 shadow-md'
            )}
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question... (Shift+Enter for new line)"
              className={cn(
                'placeholder:text-muted-foreground/60 max-h-32 min-h-[24px] flex-1 resize-none border-0 bg-transparent py-1.5 text-sm leading-6 focus-visible:ring-0 focus-visible:ring-offset-0',
                '!bg-transparent'
              )}
              disabled={isPending}
              rows={1}
            />

            <div className="flex items-center gap-2 pb-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    className={cn(
                      'relative h-8 w-8 overflow-hidden rounded-xl shadow-sm transition-all duration-300',
                      prompt.trim() && !isPending
                        ? 'from-primary to-primary/90 text-primary-foreground bg-gradient-to-r hover:scale-110 hover:rotate-6 hover:shadow-lg'
                        : 'bg-muted/60 text-muted-foreground cursor-not-allowed'
                    )}
                    disabled={isPending || !prompt.trim()}
                  >
                    <ArrowUp
                      className={cn(
                        'h-4 w-4 transition-all duration-200',
                        prompt.trim() && !isPending && 'animate-pulse'
                      )}
                    />
                    {prompt.trim() && !isPending && (
                      <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isPending ? 'Sending...' : 'Send Message'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {isPending && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 absolute -top-3 left-1/2 -translate-x-1/2 transform duration-200">
              <div className="from-primary/10 to-primary/20 text-primary border-primary/20 rounded-full border bg-gradient-to-r px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 animate-ping rounded-full" />
                  AI is thinking...
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export function AiTutorTab() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const toggleCollapse = () => {
    if (!panelRef.current) return;

    if (isCollapsed) {
      panelRef.current.resize(25);

      setIsCollapsed(false);
    } else {
      panelRef.current.collapse();

      setIsCollapsed(true);
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-12.5rem)] rounded-lg border"
      onLayout={(sizes) => {
        const sidebarSize = sizes[0];

        if (sidebarSize <= 5) {
          setIsCollapsed(true);
        } else if (sidebarSize >= 15) {
          setIsCollapsed(false);
        }
      }}
    >
      <ResizablePanel
        ref={panelRef}
        collapsible
        collapsedSize={4}
        minSize={20}
        defaultSize={25}
        maxSize={40}
        className="transition-all duration-200 ease-in-out"
      >
        <ConversationSidebar
          isCollapsed={isCollapsed}
          onToggle={toggleCollapse}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={75} minSize={60}>
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
