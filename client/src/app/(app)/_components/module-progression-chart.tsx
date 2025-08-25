'use client';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface ModuleProgressChartProps {
  data: {
    name: string;
    completed: number;
    inProgress: number;
    notStarted: number;
  }[];
}

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'var(--chart-2)',
  },
  inProgress: {
    label: 'In Progress',
    color: 'var(--chart-3)',
  },
  notStarted: {
    label: 'Not Started',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function ModuleProgressChart({ data }: ModuleProgressChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          width={120}
        />
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar
          dataKey="completed"
          stackId="a"
          fill="var(--color-completed)"
          radius={[4, 0, 0, 4]}
        />
        <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" />
        <Bar
          dataKey="notStarted"
          stackId="a"
          fill="var(--color-notStarted)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function ModuleProgressChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {/* Creates a placeholder that mimics the vertical bar layout */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-6 w-24 shrink-0" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
        {/* Placeholder for the legend */}
        <div className="flex w-full justify-center gap-x-6 gap-y-3 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
