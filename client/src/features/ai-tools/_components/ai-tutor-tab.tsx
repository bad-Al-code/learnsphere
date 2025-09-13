'use client';

import { ArrowUp, Bot } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { ChatMessage } from '../types/inedx';

const COURSE_ID = '0b72ac05-aa68-43a3-b340-258feebf573c';

function AiStudyAssistant() {
  const { user } = useSessionStore();
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
              { id: crypto.randomUUID(), role: 'model', content: data.data! },
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Card className="flex h-[calc(100vh-12.5rem)] flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
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
            {msg.role === 'model' && (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div className="max-w-md space-y-1">
              <div
                className={cn(
                  'rounded-lg p-3 text-sm whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none',
                  msg.role === 'system' &&
                    'bg-destructive/10 text-destructive rounded-none'
                )}
              >
                <p>{msg.content}</p>
              </div>
            </div>

            {msg.role === 'user' && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={user?.avatarUrls?.small}
                  alt={user?.firstName || 'User'}
                />
                <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isPending && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="bg-muted max-w-md space-y-2 rounded-lg p-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        )}
      </CardContent>

      <CardContent className="">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question... (Shift+Enter for new line)"
            className="max-h-48 min-h-12 resize-none pr-12"
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
  return (
    <div className="space-y-2">
      <AiStudyAssistant />
    </div>
  );
}

export function AiTutorTabSkeleton() {
  return (
    <div className="space-y-2">
      <Card className="flex h-[calc(100vh-12.5rem)] flex-col">
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
    </div>
  );
}
