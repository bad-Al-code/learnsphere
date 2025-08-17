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
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface PerformanceTrendData {
  month: string;
  completion: number;
  satisfaction: number;
  engagement: number;
  retention: number;
}

interface PerformanceTrendsChartProps {
  data?: PerformanceTrendData[];
}

const placeholderData: PerformanceTrendData[] = [
  {
    month: 'Jan',
    completion: 70,
    satisfaction: 4.2,
    engagement: 78,
    retention: 90,
  },
  {
    month: 'Feb',
    completion: 75,
    satisfaction: 4.3,
    engagement: 80,
    retention: 92,
  },
  {
    month: 'Mar',
    completion: 72,
    satisfaction: 4.1,
    engagement: 82,
    retention: 88,
  },
  {
    month: 'Apr',
    completion: 76,
    satisfaction: 4.4,
    engagement: 85,
    retention: 94,
  },
  {
    month: 'May',
    completion: 78,
    satisfaction: 4.5,
    engagement: 88,
    retention: 95,
  },
  {
    month: 'Jun',
    completion: 79,
    satisfaction: 4.6,
    engagement: 86,
    retention: 96,
  },
];

const chartConfig = {
  completion: {
    label: 'Completion Rate',
    color: 'var(--chart-4)',
  },
  satisfaction: {
    label: 'Satisfaction',
    color: 'var(--chart-2)',
  },
  engagement: {
    label: 'Engagement',
    color: 'var(--chart-1)',
  },
  retention: {
    label: 'Retention',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function PerformanceTrendsChart({
  data = placeholderData,
}: PerformanceTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Key metrics over the last 6 months</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[0, 25, 50, 75, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="natural"
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={{
                  fill: `var(--color-${key})`,
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceTrendsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative h-[250px] w-full p-4">
          <div className="absolute inset-0 border-b border-l" />

          <div className="relative flex h-full w-full items-center justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative flex h-full w-full items-center">
                <Skeleton className="h-[2px] w-full" />
                <Skeleton className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
