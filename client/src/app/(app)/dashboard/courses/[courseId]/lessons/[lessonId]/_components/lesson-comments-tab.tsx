'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';
import { MessageSquare, MoreHorizontal } from 'lucide-react';

interface Comment {
  name: string;
  timestamp: string;
  body: string;
  replyCount?: number;
}

interface LessonCommentsTabProps {
  data?: Comment[];
}

const placeholderData: Comment[] = [
  {
    name: 'Sarah Johnson',
    timestamp: '2 hours ago',
    body: 'Great explanation of the concepts! Could you provide more examples of real-world applications?',
    replyCount: 2,
  },
  {
    name: 'Mike Chen',
    timestamp: '1 day ago',
    body: "I'm having trouble understanding the third part. Could you clarify the difference between supervised and unsupervised learning?",
    replyCount: 1,
  },
  {
    name: 'Emma Davis',
    timestamp: '2 days ago',
    body: 'This lesson was very helpful. The examples made it easy to understand.',
  },
];

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <p className="font-semibold">{comment.name}</p>
                <p className="text-muted-foreground text-xs">
                  {comment.timestamp}
                </p>
              </div>
              <p className="text-foreground text-sm">{comment.body}</p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="-ml-3">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                {comment.replyCount && (
                  <span className="cursor-pointer text-xs font-semibold text-blue-500 hover:underline">
                    {comment.replyCount} replies
                  </span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full max-w-lg" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonCommentsTab({
  data = placeholderData,
}: LessonCommentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Comments & Discussions</CardTitle>
        <CardDescription>
          Student questions and discussions about this lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((comment, index) => (
          <CommentCard key={index} comment={comment} />
        ))}
      </CardContent>
    </Card>
  );
}

export function LessonCommentsTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-64" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommentCardSkeleton />
        <CommentCardSkeleton />
        <CommentCardSkeleton />
      </CardContent>
    </Card>
  );
}
