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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
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
    <Card className="h-[calc(100vh-8rem)]">
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
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
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
                    <AvatarFallback>
                      {getInitials(item.userName)}
                    </AvatarFallback>
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function LiveStudySessionCard({ session }: { session: StudyGroup }) {
  const formattedStartTime = session.startTime
    ? format(new Date(session.startTime), 'MMM d, h:mm a')
    : 'Not scheduled';

  const participantCount = session.participants.length;
  const maxParticipants = session.maxParticipants;
  const isNearlyFull = participantCount / maxParticipants > 0.8;

  return (
    <Card className="bg-muted/10">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate text-sm leading-tight font-semibold">
                {session.title}
              </h3>
              {session.isLive && (
                <Badge className="animate-pulse bg-red-500 px-1.5 py-0.5 text-xs text-white hover:bg-red-600">
                  <span className="relative mr-1 flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
                  </span>
                  Live
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {session.description}
            </p>
          </div>

          {session.isLive && (
            <Button
              size="sm"
              className="shrink-0 bg-green-600 text-white shadow-sm hover:bg-green-700"
            >
              <Users className="mr-1 h-3 w-3" />
              Join
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-sm">{session.description}</p>
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{session.duration}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Session Duration</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-3" />

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedStartTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Time</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-3" />

          <Badge variant="outline" className="text-xs font-normal">
            {session.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              {session.participants.slice(0, 3).map((p, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Avatar className="border-background h-7 w-7 cursor-pointer border-2 shadow-sm transition-transform hover:z-10 hover:scale-110">
                      <AvatarImage src={p.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(p.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{p.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              {participantCount > 3 && (
                <div className="bg-muted border-background flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm">
                  <span className="text-muted-foreground text-xs font-medium">
                    +{participantCount - 3}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div
              className={`text-xs font-medium ${isNearlyFull ? 'text-amber-600' : 'text-muted-foreground'}`}
            >
              {participantCount}/{maxParticipants}
            </div>

            <div className="text-muted-foreground text-xs">participants</div>
          </div>
        </div>

        {isNearlyFull && (
          <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-600 dark:bg-amber-950/20">
            <Sparkles className="h-3 w-3" />
            <span>Almost full!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LiveStudySessions() {
  const { data: studySessionsData, isLoading } = useStudyGroups();

  if (isLoading) return <LiveStudySessionsSkeleton />;

  return (
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <CardTitle>Live Study Sessions</CardTitle>
        </div>
        <CardDescription>
          Join collaborative study sessions with your peers
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-2">
            {studySessionsData?.map((session) => (
              <LiveStudySessionCard key={session.id} session={session} />
            ))}
          </div>
        </ScrollArea>
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
    <Card className="bg-muted/10">
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
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-2">
          <LiveStudySessionCardSkeleton />
          <LiveStudySessionCardSkeleton />
          <LiveStudySessionCardSkeleton />
          <LiveStudySessionCardSkeleton />
          <LiveStudySessionCardSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveActivitySkeleton() {
  return (
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-12" />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ul className="space-y-6">
          {[...Array(6)].map((_, i) => (
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
