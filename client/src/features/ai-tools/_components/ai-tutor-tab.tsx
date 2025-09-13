'use client';

import { ArrowUp, Bot } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAiTutorChat } from '../hooks/useAiTutor';
import { ChatMessage } from '../types/inedx';

const COURSE_ID = '0b72ac05-aa68-43a3-b340-258feebf573c';

function AiStudyAssistant() {
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
                <AvatarFallback>You</AvatarFallback>
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

            <div className="max-w-md space-y-1">
              <div className="bg-muted rounded-lg rounded-bl-none p-3 text-sm">
                <p className="animate-pulse">AI is thinking...</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardContent className="border-t pt-4">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="h-12 pr-12"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-1 h-9 w-9 -translate-y-1/2 rounded-full"
            disabled={isPending || !prompt.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
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
      <Card className="flex h-[74vh] flex-col">
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
