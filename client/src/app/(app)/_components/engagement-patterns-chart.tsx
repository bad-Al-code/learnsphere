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
import { Bar, ComposedChart, Legend, Line, XAxis, YAxis } from 'recharts';

interface EngagementPatternsChartProps {
  data: {
    name: string;
    logins: number;
    avgTime: number;
    discussions: number;
  }[];
}

const chartConfig = {
  logins: {
    label: 'Daily Logins',
    color: 'var(--muted-foreground)',
  },
  avgTime: {
    label: 'Avg Time (hrs)',
    color: 'var(--destructive)',
  },
  discussions: {
    label: 'Discussions',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function EngagementPatternsChart({
  data,
}: EngagementPatternsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ComposedChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent />}
        />
        <Legend iconType="circle" iconSize={10} />
        <Bar
          dataKey="logins"
          fill="var(--color-logins)"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="avgTime"
          stroke="var(--color-avgTime)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="discussions"
          stroke="var(--color-discussions)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

export function EngagementPatternsChartSkeleton() {
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
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  );
}
