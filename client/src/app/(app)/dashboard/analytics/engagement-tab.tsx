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
              className="fill-muted-foreground text-sm"
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
  const skeletonBarWidths = [
    'w-[55%]',
    'w-[78%]',
    'w-[85%]',
    'w-[72%]',
    'w-[68%]',
    'w-[91%]',
  ];

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-1 h-5 w-72" />
      </CardHeader>
      <CardContent className="flex h-[300px] flex-col justify-around pr-4 pl-8">
        {skeletonBarWidths.map((width, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-5 w-28 shrink-0" />
            <Skeleton className={`h-5 ${width}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
