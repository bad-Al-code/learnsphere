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
import { Trophy } from 'lucide-react';

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

function LeaderboardItem({ entry }: { entry: LeaderboardEntry }) {
  const rankColors: { [key: number]: string } = {
    1: 'bg-amber-400 text-amber-900',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-orange-400 text-orange-900',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border p-3',
        entry.isCurrentUser ? 'bg-muted' : 'bg-background'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          rankColors[entry.rank] ||
            'bg-muted-foreground/30 text-muted-foreground'
        )}
      >
        {entry.rank}
      </div>
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-muted/50 border">
          {getInitials(entry.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="font-semibold">
          {entry.name} {entry.isCurrentUser && '(You)'}
        </p>
        <p className="text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
          <span>{entry.xp.toLocaleString()} XP</span>
          <span>{entry.avgGrade}% avg</span>
          <span>{entry.streak} day streak</span>
        </p>
      </div>
      {entry.isCurrentUser && <Badge variant="outline">You</Badge>}
    </div>
  );
}

export function ClassLeaderboard() {
  const data = placeholderData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <CardTitle>Class Leaderboard</CardTitle>
        </div>
        <CardDescription>
          Top performers based on XP points, grades, and streaks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.students.map((student) => (
          <LeaderboardItem key={student.rank} entry={student} />
        ))}
      </CardContent>
      <CardFooter className="bg-card mx-4 flex-col items-start gap-1 rounded-lg border p-4">
        <p className="font-semibold">
          🎉 You're in the top {data.currentUserStats.percentile}% of the class!
        </p>
        <p className="text-muted-foreground text-sm">
          {data.currentUserStats.nextRankInfo}
        </p>
      </CardFooter>
    </Card>
  );
}

function LeaderboardItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-grow space-y-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function ClassLeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <LeaderboardItemSkeleton key={index} />
        ))}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 p-4">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-64" />
      </CardFooter>
    </Card>
  );
}
