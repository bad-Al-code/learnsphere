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
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

interface EngagementData {
  week: string;
  logins: number;
}

interface EngagementPatternsChartProps {
  data?: EngagementData[];
}

const placeholderData: EngagementData[] = [
  { week: 'Week 1', logins: 150 },
  { week: 'Week 2', logins: 185 },
  { week: 'Week 3', logins: 205 },
  { week: 'Week 4', logins: 170 },
];

const chartConfig = {
  logins: {
    label: 'Weekly Logins',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function EngagementPattern({
  data = placeholderData,
}: EngagementPatternsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Patterns</CardTitle>
        <CardDescription>Student login and activity patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="logins" fill="var(--color-logins)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                fontSize={12}
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function EngagementPatternSkeleton() {
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
        <div className="flex h-[250px] w-full items-end gap-4 border-b border-l p-4">
          <Skeleton className="h-[60%] w-full" />
          <Skeleton className="h-[75%] w-full" />
          <Skeleton className="h-[90%] w-full" />
          <Skeleton className="h-[65%] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
