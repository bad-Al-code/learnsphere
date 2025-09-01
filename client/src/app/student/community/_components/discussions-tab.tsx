'use client';

import { faker } from '@faker-js/faker';
import {
  Bot,
  Hash,
  Heart,
  Info,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TReaction = { emoji: React.ElementType; count: number; color: string };
type TDiscussion = {
  id: string;
  isStarred: boolean;
  title: string;
  author: string;
  authorInitials: string;
  role: string;
  timestamp: string;
  content: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: number;
  reactions: TReaction[];
};

const createDiscussion = (isStarred: boolean): TDiscussion => {
  const name = faker.person.fullName();
  return {
    id: faker.string.uuid(),
    isStarred,
    title: faker.lorem.sentence().replace('.', '?'),
    author: name,
    authorInitials: name
      .split(' ')
      .map((n) => n[0])
      .join(''),
    role: faker.helpers.arrayElement(['Student', 'Teaching Assistant']),
    timestamp: `${faker.number.int({ min: 2, max: 10 })}h ago`,
    content: faker.lorem.paragraph(),
    tags: faker.helpers.arrayElements(
      [
        'React',
        'Architecture',
        'Best Practices',
        'Database',
        'Normalization',
        'UI/UX',
        'Design System',
      ],
      { min: 2, max: 3 }
    ),
    upvotes: faker.number.int({ min: 10, max: 50 }),
    downvotes: faker.number.int({ min: 0, max: 5 }),
    replies: faker.number.int({ min: 5, max: 15 }),
    reactions: [
      {
        emoji: Star,
        count: faker.number.int({ min: 5, max: 25 }),
        color: 'text-yellow-500',
      },
      {
        emoji: Heart,
        count: faker.number.int({ min: 5, max: 15 }),
        color: 'text-red-500',
      },
      {
        emoji: Sparkles,
        count: faker.number.int({ min: 5, max: 10 }),
        color: 'text-blue-500',
      },
    ],
  };
};

const discussionsData: TDiscussion[] = [
  createDiscussion(true),
  createDiscussion(false),
  createDiscussion(false),
];

function DiscussionsHeader() {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search discussions..." className="pl-9" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="shrink-0">
            <Hash className="h-4 w-4" />
            <span className="hidden md:inline">Filter by Tag</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>Filter by Tag</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="shrink-0">
            <Bot className="h-4 w-4" />
            <span className="hidden md:inline">AI Suggested Topics</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>AI Suggested Topics</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">New Discussion</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>New Discussion</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function AiCommunityInsights() {
  return (
    <Card className="from-muted/50 to-muted/0 bg-gradient-to-r">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5" />
          AI Community Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">87%</p>
          <p className="text-muted-foreground text-xs">Questions Answered</p>
        </div>
        <div>
          <p className="text-2xl font-bold">24</p>
          <p className="text-muted-foreground text-xs">Active Discussions</p>
        </div>
        <div>
          <p className="text-2xl font-bold">156</p>
          <p className="text-muted-foreground text-xs">Community Members</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DiscussionCard({ discussion }: { discussion: TDiscussion }) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="w-full flex-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-base">
              {discussion.isStarred && (
                <Star className="h-4 w-4 text-yellow-500" />
              )}
              {discussion.title}
            </h3>

            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{discussion.authorInitials}</AvatarFallback>
              </Avatar>

              <p className="text-primary font-medium">{discussion.author}</p>
              <Badge variant="secondary">{discussion.role}</Badge>
              <span>•</span>
              <p>{discussion.timestamp}</p>
            </div>

            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm sm:text-base">
              {discussion.content}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {discussion.upvotes}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
                {discussion.downvotes}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {discussion.replies} replies
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {discussion.reactions.map((r, i) => (
                  <div
                    key={`${r.color}-${i}`}
                    className={`flex items-center gap-1 ${r.color}`}
                  >
                    <r.emoji className="h-4 w-4" />
                    {r.count}
                  </div>
                ))}
              </div>

              <div className="ml-auto flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Info className="h-4 w-4" />
                  AI Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  View Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DiscussionsHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-10 md:w-32" />
      <Skeleton className="h-10 w-10 md:w-44" />
      <Skeleton className="h-10 w-10 md:w-36" />
    </div>
  );
}

function AiCommunityInsightsSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}

function DiscussionCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {/* Avatar skeleton */}
          <Skeleton className="h-9 w-9 flex-shrink-0 rounded-full" />

          {/* Main content skeleton */}
          <div className="w-full flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 sm:w-1/2" />
            <Skeleton className="h-4 w-1/2 sm:w-1/3" />
            <Skeleton className="h-4 w-full" />

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>

            {/* Reactions & buttons skeleton */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 sm:w-28" />
                <Skeleton className="h-8 w-28 sm:w-32" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscussionsTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <DiscussionsHeader />
        <AiCommunityInsights />
        <Separator className="border-dashed" />
        <div className="space-y-2">
          {discussionsData.map((d) => (
            <DiscussionCard key={d.id} discussion={d} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function DiscussionsTabSkeleton() {
  return (
    <div className="space-y-2">
      <DiscussionsHeaderSkeleton />
      <AiCommunityInsightsSkeleton />
      <Separator className="border-dashed" />
      <div className="space-y-2">
        <DiscussionCardSkeleton />
        <DiscussionCardSkeleton />
        <DiscussionCardSkeleton />
      </div>
    </div>
  );
}
