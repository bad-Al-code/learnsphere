'use client';

import { Lightbulb, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type TQuizOption = {
  id: string;
  label: string;
  text: string;
};

type TQuizQuestion = {
  id: string;
  question: string;
  options: TQuizOption[];
};

const quizQuestion: TQuizQuestion = {
  id: 'q1',
  question:
    'What is the difference between function declarations and function expressions?',
  options: [
    {
      id: 'a',
      label: 'A',
      text: 'Function declarations are hoisted, expressions are not',
    },
    {
      id: 'b',
      label: 'B',
      text: 'Function expressions are hoisted, declarations are not',
    },
    { id: 'c', label: 'C', text: 'Both are hoisted the same way' },
    { id: 'd', label: 'D', text: 'Neither are hoisted' },
  ],
};

function PracticeQuiz() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Lightbulb className="h-5 w-5 text-blue-500" />
          </div>
          <CardTitle>Practice Quiz</CardTitle>
        </div>
        <CardDescription>
          JavaScript Functions - Intermediate Level
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Question 1 of 2</p>
          <Badge variant="outline">Intermediate</Badge>
        </div>
        <div>
          <h3 className="font-semibold">{quizQuestion.question}</h3>
          <div className="mt-4 space-y-2">
            {quizQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-3"
              >
                <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-md text-xs">
                  {option.label}
                </span>
                <span className="text-left whitespace-normal">
                  {option.text}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenerateNewQuiz() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <CardTitle>Generate New Quiz</CardTitle>
        </div>
        <CardDescription>
          Create a custom practice quiz on any topic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <label className="text-sm font-medium">Topic</label>
          <Input placeholder="e.g., JavaScript Functions" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Difficulty</label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled>
          <Sparkles className="h-4 w-4" />
          Generate Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}

function PracticeQuizSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenerateNewQuizSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function QuizTab() {
  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <PracticeQuiz />
      <GenerateNewQuiz />
    </div>
  );
}

export function QuizTabSkeleton() {
  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <PracticeQuizSkeleton />
      <GenerateNewQuizSkeleton />
    </div>
  );
}
