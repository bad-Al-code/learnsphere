'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

const gradeDistributionData = [
  { grade: 'A+', count: 12 },
  { grade: 'A', count: 15.5 },
  { grade: 'A-', count: 8 },
  { grade: 'B+', count: 3.5 },
  { grade: 'B', count: 2 },
];

const gradeChartConfig: ChartConfig = {
  count: {
    label: 'Count',
    color: 'var(--primary)',
  },
};

const timeAllocationData = [
  { activity: 'Video Lectures', value: 40, fill: 'var(--color-lectures)' },
  { activity: 'Assignments', value: 30, fill: 'var(--color-assignments)' },
  { activity: 'Reading', value: 20, fill: 'var(--color-reading)' },
  { activity: 'Discussion', value: 10, fill: 'var(--color-discussion)' },
];

const timeChartConfig: ChartConfig = {
  value: {
    label: 'Time (in %)',
  },
  lectures: {
    label: 'Video Lectures',
    color: 'hsl(221.2 83.2% 53.3%)',
  },
  assignments: {
    label: 'Assignments',
    color: 'hsl(142.1 76.2% 36.3%)',
  },
  reading: {
    label: 'Reading',
    color: 'hsl(34.9 87.5% 55.3%)',
  },
  discussion: {
    label: 'Discussion',
    color: 'hsl(0 72.2% 50.6%)',
  },
};

export function AssignmentGradeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Grade Distribution</CardTitle>
        <CardDescription>
          Your grade breakdown across all assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={gradeChartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={gradeDistributionData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="grade"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              ticks={[0, 4, 8, 12, 16]}
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Bar dataKey="count" fill="var(--primary)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TimeAllocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Allocation</CardTitle>
        <CardDescription>How you spend your study time</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={timeChartConfig}
          className="mx-auto aspect-square h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={timeAllocationData}
              dataKey="value"
              nameKey="activity"
              innerRadius={0}
              strokeWidth={2}
              labelLine={true}
              label={({ payload, ...props }) => {
                return (
                  <text {...props} className="fill-muted-foreground text-xs">
                    {`${payload.activity}: ${payload.value}%`}
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AnalyticsTab() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Course Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights into your learning performance
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <AssignmentGradeDistribution />
        <TimeAllocation />
      </div>
    </div>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
