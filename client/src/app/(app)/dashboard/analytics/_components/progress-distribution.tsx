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

interface ProgressData {
  name: string;
  value: number;
}

interface ProgressDistributionChartProps {
  data?: ProgressData[];
}

const placeholderData: ProgressData[] = [
  { name: '90-100%', value: 45 },
  { name: '80-89%', value: 68 },
  { name: '70-79%', value: 52 },
  { name: '60-69%', value: 28 },
  { name: 'Below 60%', value: 12 },
];

const chartConfig = {
  '90-100%': { label: '90-100%', color: 'var(--chart-2)' },
  '80-89%': { label: '80-89%', color: 'var(--chart-4)' },
  '70-79%': { label: '70-79%', color: 'var(--chart-1)' },
  '60-69%': { label: '60-69%', color: 'var(--chart-5)' },
  'Below 60%': { label: 'Below 60%', color: 'var(--muted-foreground)' },
} satisfies ChartConfig;

export function ProgressDistributionChart({
  data = placeholderData,
}: ProgressDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Distribution</CardTitle>
        <CardDescription>Student progress across all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, value, ...props }) => {
                const sliceColor =
                  chartConfig[name as keyof typeof chartConfig]?.color;
                return (
                  <text
                    {...props}
                    dy={props.dy}
                    fill={sliceColor}
                    className="text-sm font-medium"
                  >
                    {name}: {value}
                  </text>
                );
              }}
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

export function ProgressDistributionChartSkeleton() {
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
      <CardContent className="flex items-center justify-center py-8">
        <Skeleton className="h-48 w-48 rounded-full" />
      </CardContent>
    </Card>
  );
}
