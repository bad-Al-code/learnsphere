'use client';

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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CheckCircle2,
  MessageSquare,
  Pencil,
  Plus,
  Share2,
  Trash2,
  Zap,
} from 'lucide-react';

type TDraft = {
  id: string;
  title: string;
  course: string;
  progress: number;
  lastSaved: string;
  wordCount: number;
};
type TDiscussion = {
  id: string;
  title: string;
  course: string;
  author: string;
  replies: number;
  lastReply: string;
  isResolved: boolean;
};

const draftsData: TDraft[] = [
  {
    id: '1',
    title: 'Database Schema Design',
    course: 'Database Design',
    progress: 65,
    lastSaved: '2024-01-11 3:45 PM',
    wordCount: 1250,
  },
  {
    id: '2',
    title: 'User Research Report',
    course: 'UI/UX Principles',
    progress: 30,
    lastSaved: '2024-01-09 2:20 PM',
    wordCount: 680,
  },
];
const discussionsData: TDiscussion[] = [
  {
    id: '1',
    title: 'Database normalization best practices',
    course: 'Database Schema Design',
    author: 'Alex Smith',
    replies: 8,
    lastReply: '2h ago',
    isResolved: false,
  },
  {
    id: '2',
    title: 'React component testing strategies',
    course: 'React Component Library',
    author: 'Emma Wilson',
    replies: 12,
    lastReply: '4h ago',
    isResolved: true,
  },
  {
    id: '3',
    title: 'User interview question suggestions',
    course: 'User Research Report',
    author: 'Mike Johnson',
    replies: 6,
    lastReply: '1d ago',
    isResolved: false,
  },
];

function DraftAssignmentItem({ draft }: { draft: TDraft }) {
  return (
    <div className="hover:bg-muted/50 rounded-lg border p-4 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="font-semibold">{draft.title}</h3>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline">{draft.progress}% complete</Badge>
            <Badge variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              Auto-save
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                  <span className="hidden lg:inline">Resume Editing</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Resume Editing</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden lg:inline">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-500"
                >
                  <Trash2 className="md: h-4 w-4" />
                  <span className="hidden md:inline">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{draft.course}</p>
      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
        <span>Last saved: {draft.lastSaved}</span>
        <span>{draft.wordCount} words</span>
      </div>
      <Progress value={draft.progress} className="mt-2 h-1" />
    </div>
  );
}

function DiscussionItem({ discussion }: { discussion: TDiscussion }) {
  return (
    <div className="hover:bg-muted/50 flex flex-col items-start justify-between gap-2 rounded-lg border p-3 shadow-md sm:flex-row">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{discussion.title}</h4>
          {discussion.isResolved && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Resolved
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {discussion.course} • by {discussion.author}
        </p>
        <p className="text-muted-foreground text-xs">
          {discussion.replies} replies • {discussion.lastReply}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 w-full sm:mt-0 sm:w-auto"
      >
        Reply
      </Button>
    </div>
  );
}

function DraftAssignmentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Assignments</CardTitle>
        <CardDescription>Continue working on your saved drafts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {draftsData.map((draft) => (
          <DraftAssignmentItem key={draft.id} draft={draft} />
        ))}
      </CardContent>
    </Card>
  );
}

function AssignmentDiscussionsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <CardTitle>Assignment Discussions</CardTitle>
        </div>
        <CardDescription>
          Get help and discuss assignments with classmates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {discussionsData.map((d) => (
          <DiscussionItem key={d.id} discussion={d} />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Start New Discussion
        </Button>
      </CardFooter>
    </Card>
  );
}

function DraftAssignmentItemSkeleton() {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        {/* Top row (responsive) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          {/* Title + badges */}
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            {/* Title */}
            <Skeleton className="h-5 w-40" />
            {/* Badges */}
            <div className="mt-1 flex gap-2 md:mt-0">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Right side button(s) */}
          <div className="mt-2 flex items-center gap-2 md:mt-0">
            {/* Mobile: icon-only button */}
            <Skeleton className="h-9 w-9 md:hidden" />
            {/* Desktop: button with label */}
            <Skeleton className="hidden h-9 w-36 md:block" />
          </div>
        </div>

        {/* Course */}
        <Skeleton className="mt-2 h-4 w-32" />

        {/* Meta info */}
        <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Progress bar */}
        <Skeleton className="mt-2 h-1 w-full" />
      </CardContent>
    </Card>
  );
}

function DiscussionItemSkeleton() {
  return (
    <div className="flex items-start justify-between gap-2 space-y-2 rounded-lg border p-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  );
}

export function DraftsTab() {
  return (
    <div className="space-y-2">
      <DraftAssignmentsSection />
      <AssignmentDiscussionsSection />
    </div>
  );
}

export function DraftsTabSkeleton() {
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-2 p-2">
          <DraftAssignmentItemSkeleton />
          <DraftAssignmentItemSkeleton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          <DiscussionItemSkeleton />
          <DiscussionItemSkeleton />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-48" />
        </CardFooter>
      </Card>
    </div>
  );
}
