'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Cell, Pie, PieChart } from 'recharts';

interface RevenueBreakdownChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const chartConfig: ChartConfig = {
  revenueBreakdown: {
    label: 'Revenue Breakdown',
    color: COLORS[0],
  },
};

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  data.forEach((item, idx) => {
    chartConfig[item.name] = {
      label: item.name,
      color: COLORS[idx % COLORS.length],
    };
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export function RevenueBreakdownChartSkeleton() {
  return (
    <div className="flex h-[350px] w-full flex-col items-center space-y-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-[200px] w-[200px] rounded-full" />
      <div className="grid w-full grid-cols-2 gap-4 px-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-24" />
        ))}
      </div>
    </div>
  );
}
