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
import { getInitials } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useLiveActivity, useStudyGroups } from '../hooks/use-activity';
import { StudyGroup } from '../schema/activity.schema';

export function LiveActivity() {
  const { data: liveActivityData, isLoading } = useLiveActivity();

  const activityIcons: Record<string, LucideIcon> = {
    study_session: BookOpen,
    enrollment: BookOpen,
    lesson_completion: TrendingUp,
    achievement: Trophy,
  };

  if (isLoading) return <LiveActivitySkeleton />;

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
          {liveActivityData?.map((item) => {
            const Icon = activityIcons[item.type];

            return (
              <li key={item.id} className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={item.userAvatar ?? undefined}
                    alt={item.userName}
                  />
                  <AvatarFallback>{getInitials(item.userName)}</AvatarFallback>
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
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {item.type.replace(/_/g, ' ')}
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

export function LiveStudySessionCard({ session }: { session: StudyGroup }) {
  return (
    <Card className="bg-muted/10">
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
                <AvatarImage src={p.avatarUrl ?? undefined} />
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
  const { data: studySessionsData, isLoading } = useStudyGroups();

  if (isLoading) return <LiveStudySessionsSkeleton />;

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
        {studySessionsData?.map((session) => (
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

export function ActivityTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LiveActivitySkeleton />
      <LiveStudySessionsSkeleton />
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
