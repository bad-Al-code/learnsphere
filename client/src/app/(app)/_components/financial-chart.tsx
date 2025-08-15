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
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

interface FinancialChartProps {
  data: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--destructive)',
  },
  profit: {
    label: 'Profit',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="4 3" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="#888889"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888889"
          fontSize={13}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />

        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent />}
        />
        <Legend iconType="circle" iconSize={11} />

        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[5, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="var(--color-expenses)"
          radius={[5, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="var(--color-profit)"
          strokeWidth={3}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

export function FinancialChartSkeleton() {
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
