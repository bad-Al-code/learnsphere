'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

interface EnrollmentChartProps {
  data: {
    month: string;
    enrollments: number;
    revenue: number;
    completions: number;
  }[];
}

const chartConfig = {
  students: { label: 'Students', color: 'var(--chart-1)' },
  revenue: { label: 'Revenue', color: 'var(--chart-2)' },
  completions: { label: 'Completions', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="enrollments"
          stroke="var(--color-students)"
          fill="var(--color-students)"
          dot={{ r: 3 }}
          name="Enrollments"
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          fill="var(--color-revenue)"
          dot={{ r: 3 }}
          name="Revenue"
        />
        <Bar
          dataKey="completions"
          fill="var(--color-completions)"
          radius={[4, 4, 0, 0]}
          name="Completions"
        />
      </ComposedChart>
    </ChartContainer>
  );
}

export function EnrollmentChartSkeleton() {
  return (
    <div className="flex h-[350px] w-full flex-col space-y-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />

      <div className="border-muted bg-muted/30 flex-1 rounded-md border border-dashed" />

      <div className="flex justify-between">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-10" />
        ))}
      </div>
    </div>
  );
}
