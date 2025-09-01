'use client';

import { faker } from '@faker-js/faker';
import {
  Award,
  BarChart,
  CheckCircle,
  Crown,
  Flame,
  Medal,
  Trophy,
  Users,
} from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TLeaderboardUser = {
  rank: number;
  name: string;
  initials: string;
  streak: number;
  points: number;
};

type TStat = {
  label: string;
  value: string;
};

type TAchievement = {
  title: string;
  icon: React.ElementType;
  color: string;
};

const createLeaderboardUser = (rank: number): TLeaderboardUser => {
  const name = faker.person.fullName();
  return {
    rank,
    name,
    initials: name
      .split(' ')
      .map((n) => n[0])
      .join(''),
    streak: faker.number.int({ min: 5, max: 25 }),
    points: 3000 - rank * 200 - faker.number.int({ min: 0, max: 100 }),
  };
};

const leaderboardData: TLeaderboardUser[] = Array.from({ length: 5 }, (_, i) =>
  createLeaderboardUser(i + 1)
);

const userStats: TStat[] = [
  { label: 'Study Streak', value: '12 days' },
  { label: 'Courses Completed', value: '3' },
  { label: 'Assignments Done', value: '24' },
  { label: 'Community Help', value: '18 answers' },
];

const achievementsData: TAchievement[] = [
  {
    title: '10+ day streak',
    icon: Flame,
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  {
    title: 'Helped 15+ students',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    title: 'Finished 3 courses',
    icon: CheckCircle,
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
];

function CommunityLeaderboard() {
  const rankIcons: Record<number, React.ElementType> = {
    1: Crown,
    2: Medal,
    3: Trophy,
  };
  const rankIconColors: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-gray-400',
    3: 'text-amber-600',
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <CardTitle>Community Leaderboard</CardTitle>
        </div>
        <CardDescription>Top performers this month</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {leaderboardData.map((user) => {
            const Icon = rankIcons[user.rank];
            return (
              <Card
                key={user.rank}
                className="from-muted/50 to-muted/0 bg-gradient-to-r p-0"
              >
                <div className="flex items-center p-3">
                  <div className="flex w-12 shrink-0 items-center justify-center gap-2 font-bold">
                    {Icon ? (
                      <Icon
                        className={cn('h-5 w-5', rankIconColors[user.rank])}
                      />
                    ) : (
                      <span>{user.rank}</span>
                    )}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Flame className="h-3 w-3" /> {user.streak} day streak
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{user.points.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs">points</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function YourStats() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <CardTitle>Your Stats</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="from-muted to-muted/0 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b">
            <p className="text-3xl font-bold">8</p>
          </div>
          <p className="mt-2 font-semibold">Rank #8</p>
          <p className="text-muted-foreground text-sm">1,847 points</p>
        </div>
        <Separator />

        <div className="space-y-2 text-sm">
          {userStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <p className="text-muted-foreground">{stat.label}</p>
              <p className="font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Award className="h-4 w-4" />
            Achievements
          </h3>
          <div className="space-y-2">
            {achievementsData.map((ach) => (
              <Alert key={ach.title} className={cn('p-3', ach.color)}>
                <ach.icon className="h-4 w-4" />
                <AlertDescription>{ach.title}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityLeaderboardSkeleton() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function YourStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Separator />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <Separator />
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaderboardTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      <CommunityLeaderboard />
      <YourStats />
    </div>
  );
}

export function LeaderboardTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      <CommunityLeaderboardSkeleton />
      <YourStatsSkeleton />
    </div>
  );
}
