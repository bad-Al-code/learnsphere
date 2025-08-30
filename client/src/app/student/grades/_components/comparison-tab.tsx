'use client';

import { Award, ListOrdered, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const chartData = [
  { subject: 'React', yourScore: 98, classAverage: 82 },
  { subject: 'Database', yourScore: 95, classAverage: 88 },
  { subject: 'UI/UX', yourScore: 95, classAverage: 85 },
  { subject: 'Python', yourScore: 92, classAverage: 84 },
];

const chartConfig = {
  yourScore: { label: 'Your Score', color: 'var(--chart-1)' },
  classAverage: { label: 'Class Average', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const rankingData = [
  { rank: 1, name: 'Anonymous Student', score: 96 },
  { rank: 2, name: 'Anonymous Student', score: 94 },
  { rank: 3, name: 'You', score: 90, isUser: true },
  { rank: 4, name: 'Anonymous Student', score: 88 },
  { rank: 5, name: 'Anonymous Student', score: 86 },
];

function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>Performance vs Class Average</CardTitle>
        </div>
        <CardDescription>
          See how you're performing compared to your peers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="yourScore" fill="var(--color-yourScore)" radius={4} />
            <Bar
              dataKey="classAverage"
              fill="var(--color-classAverage)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ClassRanking() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5" />
          <CardTitle>Class Ranking</CardTitle>
        </div>
        <CardDescription>Anonymous leaderboard position</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rankingData.map((player) => (
            <div
              key={player.rank}
              className={cn(
                'hover:bg-muted/50 flex items-center gap-2 rounded-md border p-2',
                player.isUser && 'bg-muted hover:bg-muted'
              )}
            >
              <span className="text-muted-foreground w-4 text-right text-sm">
                {player.rank}
              </span>
              <p className="flex-1 font-medium">{player.name}</p>
              <p className="text-sm font-semibold">{player.score}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceHighlights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <CardTitle>Performance Highlights</CardTitle>
        </div>
        <CardDescription>Your achievements and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-muted-foreground text-sm font-semibold">
            Top 15% of Class
          </h4>
          <p className="text-sm">
            You're performing better than 85% of your peers!
          </p>
        </div>
        <div className="bg-muted rounded-md p-3">
          <h4 className="font-semibold">Consistent Performer</h4>
          <p className="text-sm">
            Your grades have been above average for 6 weeks straight.
          </p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm font-semibold">
            Subject Leader
          </h4>
          <p className="text-sm">
            You have the highest grade in UI/UX Principles!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function ClassRankingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg">
            <Skeleton className="h-5 w-4" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PerformanceHighlightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="bg-muted space-y-2 rounded-md p-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ComparisonTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PerformanceChart />
      </div>
      <ClassRanking />
      <PerformanceHighlights />
    </div>
  );
}

export function ComparisonTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PerformanceChartSkeleton />
      </div>
      <ClassRankingSkeleton />
      <PerformanceHighlightsSkeleton />
    </div>
  );
}
