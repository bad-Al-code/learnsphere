'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface EngagementPatternsChartProps {
  data: {
    name: string;
    logins: number;
    discussions: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background rounded-md border p-2 shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-primary text-sm">
          Daily Logins: {payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-sky-500">
          Discussions: {payload[0].payload.discussions.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function EngagementPatternsChart({
  data,
}: EngagementPatternsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar dataKey="logins" fill="hsl(var(--chart-1))" radius={2} />
      </BarChart>
    </ResponsiveContainer>
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
