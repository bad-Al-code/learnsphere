'use client';

import {
  ArrowDown,
  ArrowUp,
  Bot,
  Edit3,
  MessageCircle,
  MoreHorizontal,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn, getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { format } from 'date-fns';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { toast } from 'sonner';
import {
  useCreateConversation,
  useDeleteConversation,
  useGetConversations,
  useGetMessages,
  useRenameConversation,
} from '../hooks/useAiConversations';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { Conversation } from '../schemas/chat.schema';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

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
          toast.success('Conversation renamed successfully!');
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
          <Edit3 className="h-4 w-4" />
          Rename
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Rename Conversation</DialogTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Give your conversation a memorable name.
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Conversation Name
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a new name..."
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isPending) {
                  handleRename();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="space-y-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRename}
            disabled={
              isPending || !title.trim() || title === conversation.title
            }
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConversationDialog({
  conversationId,
  conversationTitle,
  onDelete,
}: {
  conversationId: string;
  conversationTitle: string;
  onDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete(conversationId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>

            <DialogTitle>Delete Conversation</DialogTitle>
          </div>

          <p className="text-muted-foreground text-sm">
            This action cannot be undone. This will permanently delete the
            conversation and all its messages.
          </p>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-foreground text-sm font-medium">
            "{conversationTitle}"
          </p>
        </div>

        <DialogFooter className="space-y-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={handleDelete} variant="destructive" className="">
            <Trash2 className="h-4 w-4" />
            Delete Conversation
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
  courseId,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  courseId: string;
}) {
  const { data: conversations, isLoading } = useGetConversations(courseId);
  const { mutate: createConversation } = useCreateConversation();
  const { mutate: deleteConversation } = useDeleteConversation();

  const handleNewChat = () => {
    createConversation(
      { courseId },
      {
        onSuccess: (result) => {
          if (result.data) {
            setActiveConversationId(result.data.id);

            toast.success('New chat created!');
          } else if (result.error) {
            toast.error(result.error);
          }
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteConversation(id, {
      onSuccess: () => {
        if (activeConversationId === id) {
          setActiveConversationId(null);
        }

        toast.success('Chat deleted successfully!');
      },
      onError: (error) => toast.error(error.message),
    });
  };

  if (isLoading) {
    return <ConversationSidebarSkeleton isCollapsed={isCollapsed} />;
  }

  return (
    <div className="bg-background/50 flex h-full flex-col">
      <div className="bg-background/80 flex items-center justify-between border-b px-3 py-3 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
              <MessageCircle className="text-primary h-4 w-4" />
            </div>
            <h2 className="text-foreground font-semibold">Chats</h2>
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
              <Button
                size="icon"
                variant="ghost"
                onClick={onToggle}
                className="h-8 w-8"
              >
                {isCollapsed ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </TooltipContent>
          </Tooltip>

          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleNewChat}
                  className="hover:bg-primary/10 hover:text-primary h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start new chat</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isCollapsed ? (
          <div className="p-2">
            <div className="space-y-1">
              {conversations?.map((convo) => (
                <div
                  key={convo.id}
                  className={cn(
                    'group relative flex items-center rounded-lg border transition-all duration-200',
                    activeConversationId === convo.id
                      ? 'border-primary/20 bg-primary/5 shadow-sm'
                      : 'hover:border-border/50 hover:bg-muted/30 border-transparent'
                  )}
                >
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full justify-start gap-3 rounded-lg p-3 text-left hover:bg-transparent"
                    onClick={() => setActiveConversationId(convo.id)}
                  >
                    <div className="from-primary/10 to-primary/5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                      <MessageCircle className="text-primary/70 h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {convo.title}
                      </p>

                      <p className="text-muted-foreground text-xs">
                        {new Date(
                          convo.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>

                  <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-background/80 h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        <RenameConversationDialog conversation={convo} />

                        <DropdownMenuSeparator />

                        <DeleteConversationDialog
                          conversationId={convo.id}
                          conversationTitle={convo.title}
                          onDelete={handleDelete}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {conversations?.length === 0 && (
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-muted/50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <MessageCircle className="text-muted-foreground h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    No chats yet
                  </p>
                  <p className="text-muted-foreground/70 text-xs">
                    Start a conversation to begin learning
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-primary/10 hover:text-primary h-10 w-10"
                  onClick={handleNewChat}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Start new chat</TooltipContent>
            </Tooltip>

            <div className="w-full space-y-1">
              {conversations?.slice(0, 5).map((convo) => (
                <Tooltip key={convo.id}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={
                        activeConversationId === convo.id
                          ? 'secondary'
                          : 'ghost'
                      }
                      className="h-10 w-10"
                      onClick={() => setActiveConversationId(convo.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="truncate">{convo.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AiStudyAssistant({
  activeConversationId,
  setActiveConversationId,
  courseId,
}: {
  courseId: string;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}) {
  const { user } = useSessionStore();
  const [prompt, setPrompt] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const previousScrollHeight = useRef<number>(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useGetMessages(activeConversationId);

  const { mutate: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();

  const { mutate: sendMessage, isPending: isSendingMessage } =
    useAiTutorChat(activeConversationId);

  const isPending = isSendingMessage || isCreatingConversation;

  const messages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.messages) ?? [];

  const scrollToBottom = (smooth = true) => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });

    setShouldScrollToBottom(false);
    setShowScrollButton(false);
  };

  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (shouldScrollToBottom) {
      scrollToBottom(false);
    } else if (isFetchingNextPage && previousScrollHeight.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeight.current;
      container.scrollTop = scrollDifference;
    }

    previousScrollHeight.current = container.scrollHeight;
  }, [messages.length, isFetchingNextPage, shouldScrollToBottom]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || !isNearBottom) return;

    setShouldScrollToBottom(true);
  }, [messages.length, isNearBottom]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollFromBottom = scrollHeight - scrollTop - clientHeight;

      const nearBottom = scrollFromBottom < 100;
      setIsNearBottom(nearBottom);

      const shouldShowButton = scrollFromBottom > 200 && messages.length > 0;
      setShowScrollButton(shouldShowButton);

      if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        previousScrollHeight.current = scrollHeight;
        fetchNextPage();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messages.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isPending) return;

    const currentPrompt = prompt;
    setPrompt('');

    if (activeConversationId) {
      sendMessage({
        courseId,
        prompt: currentPrompt,
        conversationId: activeConversationId,
      });
    } else {
      createConversation(
        {
          courseId,
          title:
            currentPrompt.substring(0, 40) +
            (currentPrompt.length > 40 ? '...' : ''),
        },

        {
          onSuccess: (result) => {
            if (result.data) {
              const newConversationId = result.data.id;
              setActiveConversationId(newConversationId);

              sendMessage({
                courseId,
                prompt: currentPrompt,
                conversationId: newConversationId,
              });
            } else if (result.error) {
              toast.error(result.error);
            }
          },

          onError: (error) => {
            toast.error(`Failed to create conversation: ${error.message}`);
          },
        }
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  if (!activeConversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="max-w-md space-y-8 text-center">
          <div className="relative flex items-center justify-center">
            <div className="from-primary/20 to-primary/5 ring-primary/10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ring-1">
              <Bot className="text-primary h-12 w-12" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              AI Study Assistant
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ready to help you learn! Start a new conversation or select an
              existing one to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left">
            {[
              {
                icon: MessageCircle,
                text: 'Ask questions about your course',
                color: 'blue',
              },
              {
                icon: Sparkles,
                text: 'Get explanations and examples',
                color: 'purple',
              },
              {
                icon: Bot,
                text: 'Receive personalized study tips',
                color: 'green',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={cn(
                  'border-border/50 flex items-center gap-4 rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
                  item.color === 'blue' &&
                    'from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/20',
                  item.color === 'purple' &&
                    'from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/20',
                  item.color === 'green' &&
                    'from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/20'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg ring-1',
                    item.color === 'blue' &&
                      'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400',
                    item.color === 'purple' &&
                      'bg-purple-500/10 text-purple-600 ring-purple-500/20 dark:text-purple-400',
                    item.color === 'green' &&
                      'bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-foreground font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth p-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {isLoadingMessages ? (
          <AiStudyAssistantSkeleton />
        ) : (
          <div className="space-y-6">
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="text-muted-foreground bg-background/80 ring-border/50 flex items-center gap-3 rounded-full px-4 py-2 text-sm shadow-sm ring-1 backdrop-blur-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  Loading older messages...
                </div>
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex items-center justify-center py-16">
                <div className="max-w-md space-y-6 text-center">
                  <div className="relative mx-auto h-20 w-20">
                    <Bot className="text-primary/60 h-20 w-20 animate-pulse" />
                    <div className="from-primary/30 absolute inset-0 animate-spin rounded-full bg-gradient-to-r to-transparent opacity-20" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-foreground text-xl font-semibold">
                      Ready to help you learn!
                    </h3>
                    <p className="text-muted-foreground/80">
                      Ask me questions about your course content, request
                      explanations, or get study tips.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={cn(
                  'animate-in fade-in-0 slide-in-from-bottom-2 flex gap-4 duration-300',
                  msg.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div className="ring-border/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ring-1">
                  {msg.role === 'user' ? (
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage
                        src={user?.avatarUrls?.small}
                        alt={user?.firstName || 'User'}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(user?.firstName)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Bot className="text-primary h-4 w-4" />
                  )}
                </div>

                <div
                  className={cn(
                    'space-y-2 transition-all duration-200',
                    msg.role === 'user'
                      ? 'max-w-[70%] min-w-0'
                      : 'min-w-0 flex-1'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      msg.role === 'user' && 'justify-end'
                    )}
                  >
                    <span className="text-foreground text-sm font-semibold">
                      {msg.role === 'user'
                        ? 'You'
                        : msg.role === 'system'
                          ? 'System Error'
                          : 'AI Assistant'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {msg.createdAt
                        ? format(new Date(msg.createdAt), 'p')
                        : ''}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'group prose prose-sm dark:prose-invert max-w-none rounded-2xl border p-4 shadow-sm ring-1 transition-all duration-300 hover:shadow-md',
                      msg.role === 'user'
                        ? 'border-primary/20 from-primary/8 to-primary/12 hover:from-primary/12 hover:to-primary/16 ring-primary/10 bg-gradient-to-br'
                        : msg.role === 'system'
                          ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100 ring-red-200/50 hover:shadow-red-100 dark:from-red-900/20 dark:to-red-800/20'
                          : 'border-border/50 from-background/80 to-muted/30 hover:from-muted/40 hover:to-muted/50 ring-border/20 bg-gradient-to-br'
                    )}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isPending && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex gap-4 duration-300">
                <div className="ring-border/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ring-1">
                  <Bot className="text-primary h-4 w-4 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      AI Assistant
                    </span>
                    <span className="text-muted-foreground animate-pulse text-xs">
                      Thinking...
                    </span>
                  </div>
                  <div className="border-border/50 from-background/80 to-muted/30 ring-border/20 w-fit rounded-2xl border bg-gradient-to-br p-4 shadow-sm ring-1">
                    <div className="flex space-x-2">
                      <div className="bg-primary/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                      <div className="bg-primary/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                      <div className="bg-primary/60 h-2 w-2 animate-bounce rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative p-2 backdrop-blur-sm">
        {showScrollButton && (
          <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2">
            <Button
              size="sm"
              variant="secondary"
              className="ring-border/20 shadow-lg ring-1 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => scrollToBottom(true)}
            >
              <ArrowDown className="h-4 w-4" />
              Back to bottom
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-background/90 focus-within:ring-primary/30 ring-border/20 relative flex items-end gap-3 rounded-2xl border p-3 shadow-lg ring-1 backdrop-blur-sm transition-all duration-300 focus-within:shadow-xl focus-within:ring-2 hover:shadow-lg">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your course... (Press Shift+Enter for new line)"
              className="placeholder:text-muted-foreground/70 max-h-56 min-h-[44px] flex-1 resize-none border-0 bg-transparent py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isPending}
              rows={1}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-xl shadow-sm ring-1 transition-all duration-300',
                    prompt.trim() && !isPending
                      ? 'bg-primary hover:bg-primary/90 ring-primary/20 hover:scale-110 hover:shadow-lg active:scale-95'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted/50 ring-muted/20 cursor-not-allowed'
                  )}
                  disabled={isPending || !prompt.trim()}
                >
                  {isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPending ? 'Sending...' : 'Send message'}
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AiTutorTab({ courseId }: { courseId?: string }) {
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

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12.5rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-background h-full rounded-lg border shadow-sm"
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
            courseId={courseId}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-border/50 hover:bg-border w-1 transition-colors"
        />

        <ResizablePanel defaultSize={75} minSize={60}>
          <AiStudyAssistant
            key={activeConversationId}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            courseId={courseId}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function AiTutorTabSkeleton() {
  return (
    <div className="bg-background h-[calc(100vh-12.5rem)] rounded-lg border shadow-sm">
      <div className="flex h-full">
        <div className="w-1/4 border-r">
          <ConversationSidebarSkeleton isCollapsed={false} />
        </div>
        <div className="flex-1">
          <AiStudyAssistantSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ConversationSidebarSkeleton({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  return (
    <div className="bg-background/50 flex h-full flex-col">
      <div className="bg-background/80 flex items-center justify-between border-b px-3 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-5 w-12" />
          </div>
        )}
        <div
          className={cn(
            'flex items-center gap-1',
            isCollapsed && 'w-full justify-center'
          )}
        >
          <Skeleton className="h-8 w-8 rounded-md" />
          {!isCollapsed && <Skeleton className="h-8 w-8 rounded-md" />}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!isCollapsed ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-transparent p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AiStudyAssistantSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-4',
                i % 2 === 0 ? 'flex-row-reverse' : ''
              )}
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="rounded-lg border p-4 shadow-sm">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
