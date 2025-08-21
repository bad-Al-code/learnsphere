'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Flag,
  Heart,
  Lightbulb,
  LucideIcon,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Reply,
  Search,
  Send,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

interface StatCardData {
  title: string;
  value: number;
  icon: LucideIcon;
}
interface AIStatCardData {
  title: string;
  value: number;
  description: string;
  variant: 'green' | 'red' | 'blue';
  icon: LucideIcon;
}
interface ReplyData {
  author: string;
  isInstructor: boolean;
  timestamp: string;
  body: string;
}
interface CommentData {
  name: string;
  timestamp: string;
  status: string;
  sentiment?: string;
  body: string;
  likes: number;
  replies?: ReplyData[];
  aiSuggestion?: string;
}

const placeholderData: {
  stats: StatCardData[];
  aiStats: AIStatCardData[];
  comments: CommentData[];
} = {
  stats: [
    { title: 'Total Comments', value: 5, icon: MessageSquare },
    { title: 'Approved', value: 4, icon: CheckCircle2 },
    { title: 'Flagged', value: 1, icon: Flag },
    { title: 'Pending', value: 0, icon: Clock },
    { title: 'Questions', value: 2, icon: MessageSquare },
  ],
  aiStats: [
    {
      title: 'Auto-Approved',
      value: 8,
      description: 'High confidence positive comments',
      variant: 'green',
      icon: CheckCircle2,
    },
    {
      title: 'Auto-Flagged',
      value: 1,
      description: 'Detected spam or inappropriate content',
      variant: 'red',
      icon: AlertTriangle,
    },
    {
      title: 'AI Responses',
      value: 3,
      description: 'Questions with suggested responses',
      variant: 'blue',
      icon: Lightbulb,
    },
  ],
  comments: [
    {
      name: 'Sarah Chen',
      timestamp: '2 hours ago',
      status: 'Approved',
      sentiment: 'positive (92%)',
      body: 'Great explanation of React hooks! The examples really helped me understand the concept.',
      likes: 5,
      replies: [
        {
          author: 'Instructor',
          isInstructor: true,
          timestamp: '1 hour ago',
          body: "Thank you Sarah! I'm glad the examples were helpful. Feel free to ask if you have any questions.",
        },
      ],
    },
    {
      name: 'Mike Rodriguez',
      timestamp: '4 hours ago',
      status: 'Approved',
      sentiment: 'neutral (88%)',
      body: "Could you explain more about the useEffect cleanup function? I'm still confused about when it runs.",
      likes: 3,
      aiSuggestion:
        'The useEffect cleanup function runs when the component unmounts or before the effect runs again. You can see a detailed explanation at timestamp 3:45 in the video. Would you like me to create a quick summary of the key points?',
    },
    {
      name: 'Anonymous User',
      timestamp: '6 hours ago',
      status: 'Flagged',
      sentiment: 'negative (96%)',
      body: 'This is spam content that should be flagged for inappropriate material.',
      likes: 0,
    },
    {
      name: 'Emma Wilson',
      timestamp: '8 hours ago',
      status: 'Approved',
      sentiment: 'neutral (78%)',
      body: 'The video quality could be better, but the content is solid. Thanks for the lesson!',
      likes: 1,
    },
    {
      name: 'David Kim',
      timestamp: '12 hours ago',
      status: 'Approved',
      sentiment: 'positive (91%)',
      body: "When will the next lesson be available? I'm really enjoying this series!",
      likes: 2,
      aiSuggestion:
        "The next lesson in this series will be available next Tuesday! It will cover advanced state management patterns. You can enable notifications to get alerted when it's published.",
    },
  ],
};

function DiscussionStatCards({ data }: { data: StatCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {data.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="">
            <p className="text-muted-foreground text-xs">{stat.title}</p>
            <div className="mt-2 flex items-center gap-2">
              <stat.icon className="text-muted-foreground h-5 w-5" />
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AIModerationDashboard({ data }: { data: AIStatCardData[] }) {
  const variantClasses = {
    green: 'border-green-500/50 bg-green-500/10 text-green-700',
    red: 'border-red-500/50 bg-red-500/10 text-red-700',
    blue: 'border-blue-500/50 bg-blue-500/10 text-blue-700',
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle>AI Moderation Dashboard</CardTitle>
            <Badge className="bg-purple-100 text-purple-700">
              Auto-Moderated
            </Badge>
          </div>
          <div className="bg-muted flex items-center gap-1 rounded-md p-0.5 text-sm">
            <Button variant="secondary" size="sm" className="h-7">
              Overview
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              AI Suggestions
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              Analytics
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.map((stat) => (
            <div
              key={stat.title}
              className={`rounded-lg border p-4 ${variantClasses[stat.variant]}`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <stat.icon className="h-4 w-4" />
                {stat.title}
              </div>
              <p className="mt-2 text-4xl font-bold">{stat.value}</p>
              <p className="text-xs">{stat.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DiscussionFilters() {
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input placeholder="Search comments..." className="pl-8" />
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" /> All Comments{' '}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function CommentThread({ comment }: { comment: CommentData }) {
  const statusColors = {
    Approved: 'border-green-500/20',
    Flagged: 'border-red-500/50 bg-red-500/5',
  };
  return (
    <div
      className={`rounded-lg border p-4 ${statusColors[comment.status as keyof typeof statusColors] || ''}`}
    >
      <div className="flex items-start gap-4">
        <Checkbox />
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <p className="font-semibold">{comment.name}</p>
            <p className="text-muted-foreground">{comment.timestamp}</p>
            <Badge
              variant="outline"
              className="border-green-500/50 bg-green-500/10 text-green-700"
            >
              {comment.status}
            </Badge>
            {comment.sentiment && (
              <Badge variant="outline">
                <Heart className="mr-1 h-3 w-3" />
                {comment.sentiment}
              </Badge>
            )}
          </div>
          <p className="text-sm">{comment.body}</p>
          {comment.aiSuggestion && (
            <div className="rounded-lg bg-blue-500/10 p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
                <Lightbulb className="h-4 w-4" /> AI Suggested Response
              </div>
              <p>{comment.aiSuggestion}</p>
              <Button size="sm" className="mt-3">
                <Send className="mr-2 h-3 w-3" />
                Send Response
              </Button>
            </div>
          )}
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <button className="hover:text-primary flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {comment.likes}
            </button>
            <button className="hover:text-primary flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button className="hover:text-primary flex items-center gap-1">
              <Reply className="h-4 w-4" />
              Reply ({comment.replies?.length || 0})
            </button>
            <button className="hover:text-primary flex items-center gap-1">
              <Pin className="h-4 w-4" />
              Pin
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {comment.replies?.map((reply, i) => (
            <div
              key={i}
              className="flex items-start gap-4 border-l-2 pt-4 pl-4"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(reply.author)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <p className="font-semibold">{reply.author}</p>
                  {reply.isInstructor && <Badge>Instructor</Badge>}
                  <p className="text-muted-foreground">{reply.timestamp}</p>
                </div>
                <p className="text-sm">{reply.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DiscussionTab() {
  return (
    <div className="space-y-6">
      <DiscussionStatCards data={placeholderData.stats} />
      <AIModerationDashboard data={placeholderData.aiStats} />
      <DiscussionFilters />
      <Card>
        <CardHeader>
          <CardTitle>Discussion ({placeholderData.comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {placeholderData.comments.map((comment) => (
            <CommentThread key={comment.name} comment={comment} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CommentThreadSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-5 w-5 rounded-sm" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-lg" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonDiscussionTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20" />
              <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-7 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <CommentThreadSkeleton />
          <CommentThreadSkeleton />
          <CommentThreadSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
