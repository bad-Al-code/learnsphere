'use client';

import {
  ArrowUp,
  Award,
  Bot,
  Box,
  BrainCircuit,
  CheckCheck,
  Code2,
  FileText,
  Flame,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TMessage = {
  id: string;
  isCurrentUser: boolean;
  content: string;
  code?: string;
  timestamp: string;
};

type TQuickAction = {
  label: string;
  icon: React.ElementType;
};

const chatHistory: TMessage[] = [
  {
    id: '1',
    isCurrentUser: false,
    content: `**FULL OUTER JOIN**: Returns all records when there's a match in either table.\n\nWould you like me to show you some examples?`,
    timestamp: '2:31 PM',
  },
  {
    id: '2',
    isCurrentUser: true,
    content: `Yes, please show me an example with INNER JOIN`,
    timestamp: '2:32 PM',
  },
  {
    id: '3',
    isCurrentUser: false,
    content: `Here's a practical example:`,
    code: '```sql\nSELECT students.name, courses.title\nFROM students\nINNER JOIN courses ON students.course_id = courses.id;\n```',
    timestamp: '2:33 PM',
  },
];

const quickActionsData: TQuickAction[] = [
  { label: 'Explain this concept in simple terms', icon: Lightbulb },
  { label: 'Generate practice problems', icon: Target },
  { label: 'Show me code examples', icon: Code2 },
  { label: 'Create a study plan', icon: Box },
  { label: 'Summarize my notes', icon: FileText },
  { label: 'Check my understanding', icon: CheckCheck },
];

function AiTutorHeader() {
  return (
    <Card>
      <CardContent className="">
        <div className="relative">
          <Input
            placeholder="Ask me anything about your studies..."
            className="h-12 pr-10"
          />
          <Button
            size="icon"
            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-full"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AiStudyAssistant() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Study Assistant</CardTitle>
        </div>
        <CardDescription>
          Get instant help with your coursework and personalized learning
          guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-start gap-3',
              msg.isCurrentUser && 'justify-end'
            )}
          >
            {!msg.isCurrentUser && (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-md space-y-1">
              <div
                className={cn(
                  'rounded-lg p-3 text-sm',
                  msg.isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.code && (
                  <pre className="bg-background/50 mt-2 rounded p-2 font-mono text-xs">
                    {msg.code}
                  </pre>
                )}
              </div>
              <p
                className={cn(
                  'text-muted-foreground text-xs',
                  msg.isCurrentUser && 'text-right'
                )}
              >
                {msg.timestamp}
              </p>
            </div>
            {msg.isCurrentUser && (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription className="text-xs">
          Common requests to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickActionsData.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="text-muted-foreground w-full justify-start gap-2"
            >
              <action.icon className="h-4 w-4" /> {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LearningContext() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BrainCircuit className="h-5 w-5" />
          Learning Context
        </CardTitle>
        <CardDescription className="text-xs">
          AI is aware of your current progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Advanced React Development</Badge>
          <Badge variant="secondary">Module 4: State Management</Badge>
          <Badge variant="secondary">Assignment: Redux Todo App</Badge>
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Study Streak
            </p>
            <p className="font-semibold">7 days</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progress
            </p>
            <p className="font-semibold">68%</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificates
            </p>
            <p className="font-semibold">3 earned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiTutorHeaderSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function AiStudyAssistantSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-20 flex-1 rounded-lg" />
        </div>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-16 max-w-sm flex-1 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-24 flex-1 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActionPanelSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AiTutorTab() {
  return (
    <div className="space-y-2">
      <AiTutorHeader />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AiStudyAssistant />
        </div>
        <div className="space-y-2">
          <QuickActions />
          <LearningContext />
        </div>
      </div>
    </div>
  );
}

export function AiTutorTabSkeleton() {
  return (
    <div className="space-y-2">
      <AiTutorHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AiStudyAssistantSkeleton />
        </div>
        <ActionPanelSkeleton />
      </div>
    </div>
  );
}
