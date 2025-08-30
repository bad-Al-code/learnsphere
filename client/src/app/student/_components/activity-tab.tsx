'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

type TActivityType = 'study_session' | 'assignment_submit' | 'achievement';

type TLiveActivityItem = {
  id: string;
  userName: string;
  userAvatar: string;
  actionText: string;
  subject: string;
  timestamp: string;
  type: TActivityType;
};

type TStudySession = {
  id: string;
  title: string;
  description: string;
  isLive: boolean;
  duration: string;
  startTime: string;
  category: string;
  participants: { name: string; avatarUrl: string }[];
  maxParticipants: number;
};

const liveActivityData: TLiveActivityItem[] = [
  {
    id: '1',
    userName: 'Alex Johnson',
    userAvatar: 'https://i.pravatar.cc/150?u=ajohnson',
    actionText: 'started a study session',
    subject: 'React Fundamentals',
    timestamp: '2m ago',
    type: 'study_session',
  },
  {
    id: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?u=schen',
    actionText: 'submitted assignment',
    subject: 'Database Design Project',
    timestamp: '5m ago',
    type: 'assignment_submit',
  },
  {
    id: '3',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?u=mrodriguez',
    actionText: 'earned achievement',
    subject: 'Study Streak Master',
    timestamp: '10m ago',
    type: 'achievement',
  },
];

const studySessionsData: TStudySession[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    description: 'Exploring advanced React hooks patterns and best practices.',
    isLive: true,
    duration: '1h 30m',
    startTime: 'Started 30m ago',
    category: 'Web Development',
    participants: [
      { name: 'S', avatarUrl: 'https://i.pravatar.cc/150?u=s' },
      { name: 'C', avatarUrl: 'https://i.pravatar.cc/150?u=c' },
      { name: 'A', avatarUrl: 'https://i.pravatar.cc/150?u=a' },
    ],
    maxParticipants: 8,
  },
  {
    id: '2',
    title: 'Database Design Workshop',
    description: 'Collaborative database schema design and optimization.',
    isLive: false,
    duration: '2h',
    startTime: 'Starts tomorrow at 2 PM',
    category: 'Databases',
    participants: [
      { name: 'M', avatarUrl: 'https://i.pravatar.cc/150?u=m' },
      { name: 'E', avatarUrl: 'https://i.pravatar.cc/150?u=e' },
    ],
    maxParticipants: 10,
  },
];

export function LiveActivity() {
  const activityIcons: Record<TActivityType, LucideIcon> = {
    study_session: BookOpen,
    assignment_submit: TrendingUp,
    achievement: Trophy,
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl font-bold">Live Activity</CardTitle>
        <CardAction className="flex items-center justify-center gap-2 text-green-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Live
        </CardAction>
      </CardHeader>

      <CardContent>
        <ul className="space-y-6">
          {liveActivityData.map((item) => {
            const Icon = activityIcons[item.type];
            return (
              <li key={item.id} className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.userAvatar} alt={item.userName} />
                  <AvatarFallback>{item.userName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="text-sm">
                  <p className="text-muted-foreground">
                    <Icon className="text-primary mr-2 inline-block h-4 w-4" />
                    <span className="text-foreground font-semibold">
                      {item.userName}
                    </span>{' '}
                    {item.actionText}{' '}
                    <span className="text-foreground font-semibold">
                      {item.subject}
                    </span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="text-muted-foreground h-3 w-3" />
                    <span className="text-muted-foreground text-xs">
                      {item.timestamp}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {item.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function LiveStudySessionCard({ session }: { session: TStudySession }) {
  return (
    <Card className="bg-muted/20">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{session.title}</h3>
            {session.isLive && <Badge variant="destructive">Live</Badge>}
          </div>
          {session.isLive && (
            <Button size="sm" variant="outline">
              Join
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-sm">{session.description}</p>

        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {session.duration}
          </span>

          <span>{session.startTime}</span>

          <Badge variant="outline">{session.category}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {session.participants.map((p, index) => (
              <Avatar
                key={index}
                className="border-background -ml-2 h-6 w-6 border-2 first:ml-0"
              >
                <AvatarImage src={p.avatarUrl} />
                <AvatarFallback>{p.name}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          <span className="text-xs font-semibold">
            {session.participants.length}/{session.maxParticipants} participants
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveStudySessions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <CardTitle>Live Study Sessions</CardTitle>
        </div>
        <CardDescription>
          Join collaborative study sessions with your peers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {studySessionsData.map((session) => (
          <LiveStudySessionCard key={session.id} session={session} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ActivityTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LiveActivity />
      <LiveStudySessions />
    </div>
  );
}

export function LiveStudySessionCardSkeleton() {
  return (
    <Card className="bg-muted/20">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-9 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="-ml-2 h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveStudySessionsSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        <LiveStudySessionCardSkeleton />
        <LiveStudySessionCardSkeleton />
      </CardContent>
    </Card>
  );
}

export function LiveActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-12" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-start gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ActivityTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LiveActivitySkeleton />
      <LiveStudySessionsSkeleton />
    </div>
  );
}
