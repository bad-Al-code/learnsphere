'use client';

import {
  ArrowUp,
  BookOpen,
  Bot,
  Edit3,
  GraduationCap,
  MessageCircle,
  MoreHorizontal,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { toast } from 'sonner';
import {
  useCreateConversation,
  useDeleteConversation,
  useGetConversations,
  useGetEnrolledCourses,
  useGetMessages,
  useRenameConversation,
} from '../hooks/useAiConversations';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { Conversation } from '../schemas/chat.schema';
import { ChatMessage } from '../types/inedx';

function CourseSelectionSkeleton() {
  return (
    <div className="h-full space-y-6 p-8">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="aspect-video w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <CardHeader className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CourseSelectionScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: courses, isLoading, isError } = useGetEnrolledCourses();

  const handleCourseSelect = (courseId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'ai-tutor');
    params.set('courseId', courseId);

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <CourseSelectionSkeleton />;
  }

  if (isError || !courses) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <BookOpen className="text-destructive h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-foreground text-xl font-semibold">
              Unable to Load Courses
            </h3>
            <p className="text-muted-foreground max-w-md">
              We encountered an error while loading your enrolled courses.
              Please try refreshing the page.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-6 text-center">
          <div className="relative mx-auto">
            <div className="from-primary/20 to-primary/5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <GraduationCap className="text-primary h-10 w-10" />
            </div>
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-sm">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground text-2xl font-bold">
              No Courses Found
            </h3>
            <p className="text-muted-foreground max-w-md">
              You need to be enrolled in at least one course to start chatting
              with your AI Study Assistant.
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-1 gap-3 text-left">
            {[
              { icon: BookOpen, text: 'Browse available courses' },
              {
                icon: GraduationCap,
                text: 'Enroll in courses that interest you',
              },
              { icon: Bot, text: 'Return here to start learning' },
            ].map((item, index) => (
              <div
                key={index}
                className="border-border/50 bg-background/50 flex items-center gap-3 rounded-lg border p-3 backdrop-blur-sm"
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <item.icon className="text-primary h-4 w-4" />
                </div>
                <span className="text-muted-foreground text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 p-8">
      <div className="space-y-4 text-center">
        <div className="from-primary/20 to-primary/5 relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
          <Bot className="text-primary h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-foreground text-3xl font-bold">
            Choose Your Course
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Select one of your enrolled courses to start an intelligent
            conversation with your AI Study Assistant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((enrollment) => (
          <Card
            key={enrollment.enrollmentId}
            className="group hover:border-primary/30 border-border/50 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl pt-0"
            onClick={() => handleCourseSelect(enrollment.course.id)}
          >
            <div className="relative overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={enrollment.course.imageUrl || '/images/placeholder.svg'}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </AspectRatio>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

              <div className="absolute right-3 bottom-3 left-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/90">
                    {Math.round(enrollment.progressPercentage)}% Complete
                  </span>
                </div>
              </div>
            </div>

            <CardHeader className="space-y-3">
              <div className="space-y-2">
                <CardTitle className="text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold transition-colors">
                  {enrollment.course.title}
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Enrolled{' '}
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Bot className="text-primary h-4 w-4" />
                  <span className="text-primary text-xs font-medium">
                    AI Ready
                  </span>
                </div>

                <div className="bg-primary/10 flex items-center gap-1 rounded-full px-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
        <DialogFooter className="gap-2 sm:gap-0">
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

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            variant="destructive"
            className="w-full sm:w-auto"
          >
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
  const { data: conversations, isLoading } = useGetConversations();
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
  setActiveConversationId: (id: string) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useAiTutorChat();
  const { data: messages = [], isLoading: isLoadingMessages } =
    useGetMessages(activeConversationId);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isPending) return;

    const optimisticMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    };

    queryClient.setQueryData(
      ['ai-messages', activeConversationId],
      (oldData: ChatMessage[] | undefined) => [
        ...(oldData || []),
        optimisticMessage,
      ]
    );

    sendMessage(
      {
        courseId,
        prompt,
        conversationId: activeConversationId || undefined,
      },
      {
        onSuccess: (data) => {
          if (data.data) {
            if (!activeConversationId) {
              setActiveConversationId(data.data.conversationId);

              queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
            }

            queryClient.invalidateQueries({
              queryKey: ['ai-messages', data.data.conversationId],
            });
          }

          if (data.error) {
            toast.error(data.error);

            queryClient.invalidateQueries({
              queryKey: ['ai-messages', activeConversationId],
            });
          }
        },

        onError: (error) => {
          toast.error(error.message);

          queryClient.invalidateQueries({
            queryKey: ['ai-messages', activeConversationId],
          });
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

  if (!activeConversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="max-w-md space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div className="from-primary/20 to-primary/5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <Bot className="text-primary h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-foreground text-2xl font-bold">
              AI Study Assistant
            </h2>
            <p className="text-muted-foreground">
              Ready to help you learn! Start a new conversation or select an
              existing one to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {[
              { icon: MessageCircle, text: 'Ask questions about your course' },
              { icon: Sparkles, text: 'Get explanations and examples' },
              { icon: Bot, text: 'Receive personalized study tips' },
            ].map((item, index) => (
              <div
                key={index}
                className="border-border/50 flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <item.icon className="text-primary h-4 w-4" />
                </div>
                <span className="text-muted-foreground text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <AiStudyAssistantSkeleton />
        ) : (
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex items-center justify-center">
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

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={cn(
                  'animate-in fade-in-0 slide-in-from-bottom-2 flex gap-4',
                  msg.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm">
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="text-primary h-4 w-4" />
                  )}
                </div>

                <div
                  className={cn(
                    'space-y-2 transition-all duration-200',
                    msg.role === 'user'
                      ? 'max-w-[50%] min-w-0'
                      : 'min-w-0 flex-1'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      msg.role === 'user' && 'justify-end'
                    )}
                  >
                    <span className="text-sm font-medium">
                      {msg.role === 'user'
                        ? 'You'
                        : msg.role === 'system'
                          ? 'System Error'
                          : 'AI Assistant'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Just now
                    </span>
                  </div>

                  <div
                    className={cn(
                      'group prose prose-sm dark:prose-invert max-w-none rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md',
                      msg.role === 'user'
                        ? 'border-primary/20 from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 bg-gradient-to-br'
                        : msg.role === 'system'
                          ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-red-100 dark:from-red-900/20 dark:to-red-800/20'
                          : 'border-border/50 from-background/80 to-muted/20 hover:from-muted/30 hover:to-muted/40 bg-gradient-to-br'
                    )}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isPending && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm">
                  <Bot className="text-primary h-4 w-4 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI Assistant</span>
                    <span className="text-muted-foreground text-xs">
                      Thinking...
                    </span>
                  </div>
                  <div className="border-border/50 bg-background/80 rounded-lg border p-4 shadow-sm">
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

      <div className="bg-background/80 p-2 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-background/50 focus-within:border-primary/50 relative flex items-end gap-3 rounded-xl border p-3 shadow-sm backdrop-blur-sm transition-all duration-200 focus-within:shadow-md hover:shadow-md">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your course... (Press Shift+Enter for new line)"
              className="max-h-32 min-h-[24px] flex-1 resize-none border-0 bg-transparent py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isPending}
              rows={1}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    'h-8 w-8 shrink-0 rounded-lg shadow-sm transition-all duration-200',
                    prompt.trim() && !isPending
                      ? 'bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted/50 cursor-not-allowed'
                  )}
                  disabled={isPending || !prompt.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
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
