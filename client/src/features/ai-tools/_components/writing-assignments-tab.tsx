'use client';

import {
  BookText,
  Check,
  PenSquare,
  Repeat,
  Sparkles,
  TrendingUp,
  Wand2,
} from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

type TWritingTool = {
  label: string;
  icon: React.ElementType;
};

const writingToolsData: TWritingTool[] = [
  { label: 'Grammar & Spell Check', icon: Check },
  { label: 'Style Improvement', icon: TrendingUp },
  { label: 'Paraphrase Text', icon: Repeat },
  { label: 'Citation Generator', icon: BookText },
];

function AiWritingAssistant() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenSquare className="h-5 w-5" />
          <CardTitle>AI Writing Assistant</CardTitle>
        </div>
        <CardDescription>
          Get help with essays, reports, and technical documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <label className="text-sm font-medium">Writing Prompt</label>
          <Textarea
            placeholder="Describe what you want to write about..."
            className="mt-1 h-32 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Writing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="essay">Essay</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Sparkles className="h-4 w-4" />
          Generate Draft
        </Button>
      </CardFooter>
    </Card>
  );
}

function WritingTools() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          <CardTitle>Writing Tools</CardTitle>
        </div>
        <CardDescription>
          Grammar check, style suggestions, and improvements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {writingToolsData.map((tool) => (
            <Button
              key={tool.label}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <tool.icon className="h-4 w-4" />
              {tool.label}
            </Button>
          ))}
        </div>
        <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
          <AlertTitle className="font-semibold">
            Writing Score: 85/100
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <Skeleton className="h-2 w-5/6 bg-emerald-500/20" />
            <Skeleton className="h-2 w-4/6 bg-emerald-500/20" />
            <Skeleton className="h-2 w-3/6 bg-emerald-500/20" />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function AiWritingAssistantSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function WritingToolsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}

export function WritingAssistantTab({ courseId }: { courseId?: string }) {
  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-12.5rem)] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiWritingAssistant />
      <WritingTools />
    </div>
  );
}

export function WritingAssistantTabSkeleton() {
  return (
    <div className="grid h-[calc(100vh-12.5rem)] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiWritingAssistantSkeleton />
      <WritingToolsSkeleton />
    </div>
  );
}
