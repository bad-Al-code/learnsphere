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

interface ActivityTrendData {
  week: string;
  logins: number;
  completions: number;
  discussions: number;
}

interface StudentActivityTrendsProps {
  data?: ActivityTrendData[];
}

const placeholderData: ActivityTrendData[] = [
  { week: 'Week 1', logins: 150, completions: 120, discussions: 30 },
  { week: 'Week 2', logins: 185, completions: 140, discussions: 45 },
  { week: 'Week 3', logins: 205, completions: 160, discussions: 60 },
  { week: 'Week 4', logins: 175, completions: 130, discussions: 50 },
];

const chartConfig = {
  logins: {
    label: 'Logins',
    color: 'var(--chart-4)',
  },
  completions: {
    label: 'Completions',
    color: 'var(--chart-2)',
  },
  discussions: {
    label: 'Discussions',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function StudentActivityTrends({
  data = placeholderData,
}: StudentActivityTrendsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Activity Trends</CardTitle>
        <CardDescription>Weekly student engagement metrics</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey="logins"
              type="monotone"
              stroke="var(--color-logins)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="completions"
              type="monotone"
              stroke="var(--color-completions)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="discussions"
              type="monotone"
              stroke="var(--color-discussions)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function StudentActivityTrendsSkeleton() {
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
