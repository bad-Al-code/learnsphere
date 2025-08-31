'use client';

import { faker } from '@faker-js/faker';
import { Calendar, Clock, Trophy, Users, Zap } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type TWeeklyActivity = {
  week: string;
  hours: number;
  quizzes: number;
  submissions: number;
};

type TLeaderboardUser = {
  rank: number;
  initials: string;
  name: string;
  xp: number;
  streak?: number;
  avgGrade?: number;
  isCurrentUser?: boolean;
};

const heatmapData = Array.from({ length: 49 }, () => ({
  level: faker.number.int({ min: 0, max: 4 }),
}));

const leaderboardData: TLeaderboardUser[] = [
  {
    rank: 1,
    name:
      faker.person.firstName() + ' ' + faker.person.lastName().charAt(0) + '.',
    xp: 2450,
  },
  {
    rank: 2,
    name:
      faker.person.firstName() + ' ' + faker.person.lastName().charAt(0) + '.',
    xp: 2380,
  },
  { rank: 3, name: 'You', xp: 2320, isCurrentUser: true },
  {
    rank: 4,
    name:
      faker.person.firstName() + ' ' + faker.person.lastName().charAt(0) + '.',
    xp: 2280,
  },
  {
    rank: 5,
    name:
      faker.person.firstName() + ' ' + faker.person.lastName().charAt(0) + '.',
    xp: 2150,
  },
].map((user) => ({
  ...user,
  initials: user.name
    .split(' ')
    .map((n) => n[0])
    .join(''),
  streak: faker.number.int({ min: 5, max: 20 }),
  avgGrade: faker.number.int({ min: 85, max: 98 }),
}));

const weeklyActivityData: TWeeklyActivity[] = [
  'Week 1',
  'Week 2',
  'Week 3',
  'Week 4',
].map((week) => ({
  week,
  hours: faker.number.int({ min: 10, max: 20 }),
  quizzes: faker.number.int({ min: 1, max: 5 }),
  submissions: faker.number.int({ min: 2, max: 6 }),
}));

const weeklyActivityConfig = {
  hours: { label: 'Hours Studied', color: 'var(--chart-1)' },
  quizzes: { label: 'Quizzes', color: 'var(--chart-2)' },
  submissions: { label: 'Submissions', color: 'var(--chart-3)' },
} satisfies ChartConfig;

function WeeklyActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle>Weekly Activity</CardTitle>
        </div>
        <CardDescription>
          Time spent learning, submissions, and quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={weeklyActivityConfig}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
              <Bar dataKey="quizzes" fill="var(--color-quizzes)" radius={4} />
              <Bar
                dataKey="submissions"
                fill="var(--color-submissions)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StreakTracker() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <CardTitle>Streak Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-5xl font-bold">12</p>
        <p className="text-muted-foreground text-sm">Day Streak</p>
        <div className="mt-6 text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">XP Points</p>
            <p className="text-muted-foreground text-sm">2,320 / 2,500</p>
          </div>
          <Progress value={92} className="mt-1 h-2" />
          <p className="text-muted-foreground mt-1 text-xs">
            180 XP to next level
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="outline">SQL Pro</Badge>
          <Badge variant="outline">CTE Master</Badge>
          <Badge variant="outline">Top Contributor</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Leaderboard</CardTitle>
        </div>
        <CardDescription>Top students by engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={cn(
                'hover:bg-muted/50 flex items-center gap-4 rounded-lg p-2',
                user.isCurrentUser && 'bg-muted hover:bg-muted'
              )}
            >
              <span className="text-muted-foreground w-4 text-center text-sm">
                {user.rank}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.xp} XP</p>
              </div>
              {user.isCurrentUser && <Badge variant="secondary">You</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EngagementHeatmap() {
  const intensityColors = [
    'bg-muted',
    'bg-emerald-500/20',
    'bg-emerald-500/40',
    'bg-emerald-500/70',
    'bg-emerald-500',
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle>Engagement Heatmap</CardTitle>
        </div>
        <CardDescription>
          Daily activity intensity over the past months
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-flow-col grid-rows-7 justify-between gap-1">
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={cn('h-3 w-3 rounded-sm', intensityColors[day.level])}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground flex items-center justify-between text-xs">
        <p>Less</p>
        <div className="flex items-center gap-1">
          {intensityColors.map((color, index) => (
            <div key={index} className={cn('h-2 w-2 rounded-sm', color)} />
          ))}
        </div>
        <p>More</p>
      </CardFooter>
    </Card>
  );
}

function ClassLeaderboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Class Leaderboard</CardTitle>
        </div>
        <CardDescription>Rankings by XP points and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>XP Points</TableHead>
              <TableHead>Activity Streak</TableHead>
              <TableHead>Avg Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user) => (
              <TableRow
                key={user.rank}
                className={user.isCurrentUser ? 'bg-muted/50' : ''}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {user.rank <= 3 ? (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    ) : null}
                    #{user.rank}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.xp}</TableCell>
                <TableCell>{user.streak} days</TableCell>
                <TableCell>{user.avgGrade}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function WeeklyActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

function StreakTrackerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="mx-auto h-12 w-16" />
        <Skeleton className="mx-auto h-4 w-24" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-2">
            <Skeleton className="h-5 w-4" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EngagementHeatmapSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-28 w-full" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </CardFooter>
    </Card>
  );
}

function ClassLeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EngagementTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <WeeklyActivity />
      </div>
      <StreakTracker />
      <Leaderboard />
      <div className="space-y-2 lg:col-span-2">
        <EngagementHeatmap />
        <ClassLeaderboard />
      </div>
    </div>
  );
}

export function EngagementTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <WeeklyActivitySkeleton />
      </div>
      <StreakTrackerSkeleton />
      <LeaderboardSkeleton />
      <div className="space-y-2 lg:col-span-2">
        <EngagementHeatmapSkeleton />
        <ClassLeaderboardSkeleton />
      </div>
    </div>
  );
}
