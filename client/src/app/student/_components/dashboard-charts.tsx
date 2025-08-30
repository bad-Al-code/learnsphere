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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar, LineChart } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ProgressDataPoint {
  week: string;
  engagement: number;
  progress: number;
}
interface HeatmapData {
  day: string;
  intensity: number[];
}

const placeholderProgressData: ProgressDataPoint[] = [
  { week: 'Week 1', engagement: 45, progress: 30 },
  { week: 'Week 2', engagement: 62, progress: 78 },
  { week: 'Week 3', engagement: 80, progress: 85 },
  { week: 'Week 4', engagement: 75, progress: 90 },
  { week: 'Week 5', engagement: 88, progress: 95 },
  { week: 'Week 6', engagement: 95, progress: 100 },
];
const placeholderHeatmapData: HeatmapData[] = [
  { day: 'Mon', intensity: [1, 2, 1, 0] },
  { day: 'Tue', intensity: [2, 3, 1, 2] },
  { day: 'Wed', intensity: [1, 2, 2, 1] },
  { day: 'Thu', intensity: [3, 3, 2, 1] },
  { day: 'Fri', intensity: [2, 3, 2, 2] },
  { day: 'Sat', intensity: [1, 1, 0, 0] },
  { day: 'Sun', intensity: [1, 2, 1, 1] },
];

const progressChartConfig = {
  engagement: { label: 'Engagement', color: 'var(--chart-1)' },
  progress: { label: 'Progress', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function LearningProgressChart({
  data = placeholderProgressData,
}: {
  data?: ProgressDataPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          <CardTitle>Learning Progress Over Time</CardTitle>
        </div>
        <CardDescription>
          Your weekly progress and engagement trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={progressChartConfig}
          className="h-[250px] w-full"
        >
          <AreaChart
            data={data}
            accessibilityLayer
            margin={{ left: -20, top: 10, right: 10 }}
          >
            <CartesianGrid vertical={true} />

            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelClassName="font-semibold"
                />
              }
            />

            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="progress"
              type="natural"
              fill="var(--color-progress)"
              fillOpacity={0.1}
              stroke="var(--color-progress)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area
              dataKey="engagement"
              type="natural"
              fill="var(--color-engagement)"
              fillOpacity={0.1}
              stroke="var(--color-engagement)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LearningProgressChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-52" />
        </div>
        <Skeleton className="mt-1 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

const intensityColors = [
  'bg-muted/50',
  'bg-green-500/40',
  'bg-green-500/70',
  'bg-green-500',
];

export function EngagementHeatmap({
  data = placeholderHeatmapData,
}: {
  data?: HeatmapData[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle>Engagement Heatmap</CardTitle>
        </div>
        <CardDescription>
          Daily activity intensity over the past month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          {data.map((col) => (
            <div key={col.day} className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-xs font-semibold">
                {col.day}
              </p>
              <div className="flex flex-col gap-2">
                {col.intensity.map((level, i) => (
                  <div
                    key={i}
                    className={cn('h-5 w-5 rounded-md', intensityColors[level])}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((level, i) => (
              <div
                key={i}
                className={cn('h-2 w-2 rounded-full', intensityColors[level])}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EngagementHeatmapSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="mt-1 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-6" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-5 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
