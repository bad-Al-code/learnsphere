'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  MessageSquare,
  PlusCircle,
  Signal,
  Users,
  Video,
} from 'lucide-react';

type TStudyGroup = {
  id: string;
  title: string;
  course: string;
  description: string;
  members: number;
  active: number;
  nextSession: string;
  isJoined: boolean;
};
type TUpcomingSession = {
  id: string;
  title: string;
  course: string;
  instructor: string;
  dateTime: string;
  type: string;
  isCompleted: boolean;
};
type TDiscussion = {
  id: string;
  title: string;
  course: string;
  author: string;
  authorInitials: string;
  replies: number;
  lastReply: string;
  isInstructor: boolean;
};

const studyGroupsData: TStudyGroup[] = [
  {
    id: '1',
    title: 'React Masters',
    course: 'React Fundamentals',
    description: 'Weekly study sessions focusing on advanced React patterns',
    members: 12,
    active: 8,
    nextSession: '2024-01-15 7:00 PM',
    isJoined: true,
  },
  {
    id: '2',
    title: 'Database Wizards',
    course: 'Database Design',
    description: 'Collaborative learning for database optimization techniques',
    members: 8,
    active: 6,
    nextSession: '2024-01-16 6:30 PM',
    isJoined: false,
  },
  {
    id: '3',
    title: 'UX Design Circle',
    course: 'UI/UX Principles',
    description: 'Design critique sessions and portfolio reviews',
    members: 15,
    active: 12,
    nextSession: '2024-01-17 8:00 PM',
    isJoined: true,
  },
];
const upcomingSessionsData: TUpcomingSession[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    course: 'React Fundamentals',
    instructor: 'Sarah Chen',
    dateTime: '2024-01-15 • 2:00 PM - 3:30 PM',
    type: 'Live Session',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Database Normalization Workshop',
    course: 'Database Design',
    instructor: 'Mike Johnson',
    dateTime: '2024-01-16 • 1:00 PM - 2:30 PM',
    type: 'Workshop',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Assignment Review Session',
    course: 'React Fundamentals',
    instructor: 'Sarah Chen',
    dateTime: '2024-01-14 • 3:00 PM - 4:00 PM',
    type: 'Review',
    isCompleted: true,
  },
];
const discussionsData: TDiscussion[] = [
  {
    id: '1',
    title: 'Best practices for state management in React',
    course: 'React Fundamentals',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    replies: 23,
    lastReply: '2h ago',
    isInstructor: true,
  },
  {
    id: '2',
    title: 'When to use useCallback vs useMemo?',
    course: 'React Fundamentals',
    author: 'Alex Smith',
    authorInitials: 'AS',
    replies: 15,
    lastReply: '5h ago',
    isInstructor: false,
  },
  {
    id: '3',
    title: 'Database indexing strategies',
    course: 'Database Design',
    author: 'Mike Johnson',
    authorInitials: 'MJ',
    replies: 18,
    lastReply: '1d ago',
    isInstructor: true,
  },
];

export function StudyGroupCard({ group }: { group: TStudyGroup }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">
          <h3 className="font-bold">{group.title}</h3>
        </CardTitle>
        <CardDescription>
          <p className="text-muted-foreground text-sm">{group.course}</p>
        </CardDescription>
        <CardAction>
          <Badge variant={group.isJoined ? 'default' : 'secondary'}>
            {group.isJoined ? 'Joined' : 'Available'}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">{group.description}</p>
        <div>
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.members} members
            </span>
            <span className="flex items-center gap-1">
              <Signal className="h-4 w-4" />
              {group.active} active
            </span>
          </div>
          <p className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <Calendar className="h-4 w-4" />
            Next session: {group.nextSession}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex space-x-2">
        <Button className="flex-grow">
          <MessageSquare className="mr-2 h-4 w-4" />
          {group.isJoined ? 'Join Discussion' : 'Join Group'}
        </Button>
        {group.isJoined && <Button variant="outline">Leave</Button>}
      </CardFooter>
    </Card>
  );
}

export function UpcomingSessionItem({
  session,
}: {
  session: TUpcomingSession;
}) {
  return (
    <div className="hover:bg-muted/50 flex cursor-pointer flex-col items-start gap-4 rounded-md border p-3 sm:flex-row sm:items-center">
      <div className="bg-muted rounded-md p-2">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold">{session.title}</h4>
        <p className="text-muted-foreground text-sm">
          {session.course} • {session.instructor}
        </p>
        <p className="text-muted-foreground text-xs">{session.dateTime}</p>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Badge variant="outline">{session.type}</Badge>
        <Button
          size="sm"
          variant="outline"
          className="flex-grow sm:flex-grow-0"
          disabled={session.isCompleted}
        >
          {session.isCompleted ? 'Completed' : 'Join'}
        </Button>
      </div>
    </div>
  );
}

export function DiscussionThreadItem({ thread }: { thread: TDiscussion }) {
  return (
    <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-md border p-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{thread.authorInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{thread.title}</h4>
          {thread.isInstructor && <Badge>Instructor</Badge>}
        </div>
        <p className="text-muted-foreground text-sm">
          {thread.course} • {thread.author}
        </p>
        <p className="text-muted-foreground text-xs">
          {thread.replies} replies • {thread.lastReply}
        </p>
      </div>
      <Button size="sm" variant="outline">
        Reply
      </Button>
    </div>
  );
}

export function StudyGroupCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingSessionItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-md border p-3">
      <Skeleton className="h-10 w-10 rounded-md" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
}

function DiscussionThreadItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-md border p-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  );
}

export function StudyGroupsSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Groups</h2>
          <p className="text-muted-foreground">
            Join collaborative learning sessions with your peers
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4" />
          Create Group
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {studyGroupsData.map((group) => (
          <StudyGroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}

export function UpcomingSessionsSection() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          <h3 className="text-xl font-bold">Upcoming Sessions</h3>
        </CardTitle>
        <CardDescription>
          Live sessions, workshops, and group meetings
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {upcomingSessionsData.map((session) => (
          <UpcomingSessionItem key={session.id} session={session} />
        ))}
      </CardContent>
    </Card>
  );
}

export function CourseDiscussionsSection() {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-xl font-bold">Course Discussions</h3>
        </CardTitle>
        <CardDescription>
          Join conversations with instructors and peers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {discussionsData.map((thread) => (
          <DiscussionThreadItem key={thread.id} thread={thread} />
        ))}
      </CardContent>
    </Card>
  );
}

function StudyGroupsSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudyGroupCardSkeleton />
        <StudyGroupCardSkeleton />
      </div>
    </section>
  );
}

export function UpcomingSessionsSectionSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        <UpcomingSessionItemSkeleton />
        <UpcomingSessionItemSkeleton />
      </CardContent>
    </Card>
  );
}

export function CourseDiscussionsSectionSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        <DiscussionThreadItemSkeleton />
        <DiscussionThreadItemSkeleton />
      </CardContent>
    </Card>
  );
}

export function StudyGroupTab() {
  return (
    <div className="space-y-2">
      <StudyGroupsSection />
      <UpcomingSessionsSection />
      <CourseDiscussionsSection />
    </div>
  );
}

export function StudyGroupTabSkeleton() {
  return (
    <div className="space-y-2">
      <StudyGroupsSectionSkeleton />
      <UpcomingSessionsSectionSkeleton />
      <CourseDiscussionsSectionSkeleton />
    </div>
  );
}
