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
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';

interface DemographicsChartProps {
  data: { name: string; value: number }[];
}

export function DemographicsChart({ data }: DemographicsChartProps) {
  const chartConfig = useMemo(() => {
    return data.reduce((config, item, index) => {
      config[item.name] = {
        label: item.name,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return config;
    }, {} as ChartConfig);
  }, [data]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={false}
          labelLine={false}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="flex-rows [&>*]:flex-wrap"
        />
      </PieChart>
    </ChartContainer>
  );
}

export function DemographicsChartSkeleton() {
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
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="flex w-full max-w-sm flex-wrap justify-center gap-x-6 gap-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
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
