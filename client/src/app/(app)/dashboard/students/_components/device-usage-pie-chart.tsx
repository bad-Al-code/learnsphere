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
import { Cell, Pie, PieChart } from 'recharts';

interface DeviceData {
  name: string;
  value: number;
}

interface DeviceUsageChartProps {
  data?: DeviceData[];
}

const placeholderData: DeviceData[] = [
  { name: 'Desktop', value: 625 },
  { name: 'Mobile', value: 375 },
  { name: 'Tablet', value: 250 },
];

const chartConfig = {
  Desktop: {
    label: 'Desktop',
    color: 'var(--chart-4)',
  },
  Mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
  Tablet: {
    label: 'Tablet',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function DeviceUsageChart({
  data = placeholderData,
}: DeviceUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Usage</CardTitle>
        <CardDescription>Student device preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    chartConfig[entry.name as keyof typeof chartConfig]?.color
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DeviceUsageChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center py-8">
        <Skeleton className="h-40 w-40 rounded-full" />
      </CardContent>
    </Card>
  );
}
