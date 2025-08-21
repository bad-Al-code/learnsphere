'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { activity: 'Forum Participation', engagement: 55 },
  { activity: 'Video Completion', engagement: 78 },
  { activity: 'Assignment Submission', engagement: 85 },
  { activity: 'Quiz Participation', engagement: 72 },
  { activity: 'Resource Downloads', engagement: 68 },
  { activity: 'Discussion Posts', engagement: 91 },
];

const chartConfig = {
  engagement: {
    label: 'Engagement',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function EngagementTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>
          Detailed engagement analysis across all activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 20 ? value.slice(0, 20) + '...' : value
              }
              className="text-sm"
            />
            <XAxis dataKey="engagement" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="engagement"
              layout="vertical"
              fill="var(--color-engagement)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function EngagementTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-1 h-5 w-72" />
      </CardHeader>
      <CardContent className="flex h-[300px] w-full items-end gap-4 pr-6 pl-12">
        <Skeleton className="h-[80%] w-full" />
        <Skeleton className="h-[60%] w-full" />
        <Skeleton className="h-[90%] w-full" />
        <Skeleton className="h-[50%] w-full" />
        <Skeleton className="h-[75%] w-full" />
      </CardContent>
    </Card>
  );
}
