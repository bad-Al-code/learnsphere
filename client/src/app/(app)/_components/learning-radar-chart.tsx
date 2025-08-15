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
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

interface LearningRadarChartProps {
  data: {
    subject: string;
    current: number;
    target: number;
  }[];
}

const chartConfig = {
  current: {
    label: 'Current',
    color: 'var(--muted-foreground)',
  },
  target: {
    label: 'Target',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function LearningRadarChart({ data }: LearningRadarChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <RadarChart data={data}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />

        <Radar
          dataKey="current"
          fill="var(--color-current)"
          fillOpacity={0.6}
          stroke="var(--color-current)"
        />
        <Radar
          dataKey="target"
          fill="var(--color-target)"
          fillOpacity={0.4}
          stroke="var(--color-target)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}

export function LearningRadarChartSkeleton() {
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
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
        <div className="relative flex h-64 w-64 items-center justify-center">
          <Skeleton className="absolute h-full w-full rounded-full" />
          <Skeleton className="absolute h-2/3 w-2/3 rounded-full" />
          <Skeleton className="absolute h-1/3 w-1/3 rounded-full" />
        </div>
        <div className="flex w-full justify-center gap-x-6 gap-y-3 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
