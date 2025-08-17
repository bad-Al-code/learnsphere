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

interface GradeData {
  name: string;
  value: number;
}

interface GradeDistributionChartProps {
  data?: GradeData[];
}

const placeholderData: GradeData[] = [
  { name: 'A', value: 350 },
  { name: 'B', value: 400 },
  { name: 'C', value: 250 },
  { name: 'D', value: 150 },
  { name: 'F', value: 100 },
];

const chartConfig = {
  A: {
    label: 'Grade A',
    color: 'var(--chart-2)',
  },
  B: {
    label: 'Grade B',
    color: 'var(--chart-4)',
  },
  C: {
    label: 'Grade C',
    color: 'var(--chart-1)',
  },
  D: {
    label: 'Grade D',
    color: 'var(--chart-5)',
  },
  F: {
    label: 'Grade F',
    color: 'var(--muted-foreground)',
  },
} satisfies ChartConfig;

export function GradeDistributionChart({
  data = placeholderData,
}: GradeDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>
          Current grade distribution across all students
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, value, ...props }) => {
                return (
                  <text {...props} className="text-sm font-medium">
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

export function GradeDistributionChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <Skeleton className="h-48 w-48 rounded-full" />
      </CardContent>
    </Card>
  );
}
