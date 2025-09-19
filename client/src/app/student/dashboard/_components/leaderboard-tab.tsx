'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';
import {
  Award,
  Crown,
  Flame,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avgGrade: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface LeaderboardData {
  students: LeaderboardEntry[];
  currentUserStats: {
    percentile: number;
    nextRankInfo: string;
  };
}

const placeholderData: LeaderboardData = {
  students: [
    { rank: 1, name: 'Sarah Chen', xp: 2850, avgGrade: 94, streak: 18 },
    { rank: 2, name: 'Mike Johnson', xp: 2720, avgGrade: 91, streak: 15 },
    {
      rank: 3,
      name: 'Alex Smith',
      xp: 2680,
      avgGrade: 87,
      streak: 12,
      isCurrentUser: true,
    },
    { rank: 4, name: 'Emma Wilson', xp: 2540, avgGrade: 89, streak: 10 },
    { rank: 5, name: 'David Lee', xp: 2420, avgGrade: 85, streak: 8 },
  ],
  currentUserStats: {
    percentile: 60,
    nextRankInfo: 'Complete 2 more assignments to move up to rank 2',
  },
};

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="text-primary h-4 w-4" />;
    case 2:
      return <Medal className="text-muted-foreground h-4 w-4" />;
    case 3:
      return <Award className="h-4 w-4 text-orange-600" />;
    default:
      return null;
  }
}

function getRankBadgeVariant(rank: number) {
  switch (rank) {
    case 1:
      return 'default' as const;
    case 2:
      return 'secondary' as const;
    case 3:
      return 'outline' as const;
    default:
      return 'outline' as const;
  }
}

function LeaderboardItem({
  entry,
  isTopThree,
}: {
  entry: LeaderboardEntry;
  isTopThree: boolean;
}) {
  const rankIcon = getRankIcon(entry.rank);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-md',
        entry.isCurrentUser && 'ring-primary/20 bg-primary/5 ring-2',
        isTopThree && 'border-primary/20'
      )}
    >
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <Badge
              variant={getRankBadgeVariant(entry.rank)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full p-0 text-sm font-bold',
                entry.rank === 1 &&
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                entry.rank <= 3 && 'shadow-sm'
              )}
            >
              {entry.rank}
            </Badge>
            {rankIcon && (
              <div className="bg-background absolute -top-1 -right-1 rounded-full p-0.5">
                {rankIcon}
              </div>
            )}
          </div>

          <Avatar
            className={cn(
              'h-12 w-12 border-2 transition-all duration-300 group-hover:scale-105',
              entry.isCurrentUser ? 'border-primary' : 'border-border'
            )}
          >
            <AvatarFallback
              className={cn(
                'text-sm font-semibold',
                entry.isCurrentUser && 'bg-primary/10 text-primary'
              )}
            >
              {getInitials(entry.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  'truncate font-semibold transition-colors',
                  entry.isCurrentUser && 'text-primary'
                )}
              >
                {entry.name}
              </p>

              {entry.isCurrentUser && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                  <Star className="mr-1 h-3 w-3" />
                  You
                </Badge>
              )}

              {isTopThree && (
                <Badge variant="outline" className="px-2 py-0.5 text-xs">
                  <Trophy className="mr-1 h-3 w-3" />
                  Top 3
                </Badge>
              )}
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span className="font-medium">{entry.avgGrade}% avg</span>
              </div>

              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span className="font-medium">{entry.streak} day streak</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div
              className={cn(
                'text-xl font-bold transition-colors',
                entry.rank === 1 && 'text-primary',
                entry.rank === 2 && 'text-muted-foreground',
                entry.rank === 3 && 'text-orange-600',
                entry.rank > 3 && 'text-muted-foreground'
              )}
            >
              #{entry.rank}
            </div>

            <div className="text-muted-foreground text-xs">
              {entry.avgGrade >= 90
                ? 'Excellent'
                : entry.avgGrade >= 80
                  ? 'Good'
                  : 'Fair'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassLeaderboard() {
  const data = placeholderData;
  const topThree = data.students.slice(0, 3);
  const others = data.students.slice(3);

  return (
    <Card className="">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Trophy className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Class Leaderboard
                <Badge variant="secondary" className="text-xs">
                  Live Rankings
                </Badge>
              </CardTitle>
              <CardDescription>
                Top performers based on XP points, grades, and learning streaks
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="">
        {topThree.length > 0 && (
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="text-primary h-4 w-4" />
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Top Performers
              </h3>
            </div>
            <div className="space-y-3">
              {topThree.map((student) => (
                <LeaderboardItem
                  key={student.rank}
                  entry={student}
                  isTopThree={true}
                />
              ))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Award className="text-muted-foreground h-4 w-4" />
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Other Rankings
              </h3>
            </div>
            <div className="space-y-3">
              {others.map((student) => (
                <LeaderboardItem
                  key={student.rank}
                  entry={student}
                  isTopThree={false}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t">
        <div className="w-full space-y-3">
          <Card className="border-primary/20">
            <CardContent className="">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                  <Star className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold">
                    🎉 You're in the top {data.currentUserStats.percentile}% of
                    the class!
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {data.currentUserStats.nextRankInfo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3" />
              Rankings update daily
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function LeaderboardItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassLeaderboardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LeaderboardItemSkeleton key={index} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <LeaderboardItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t">
        <div className="w-full space-y-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
