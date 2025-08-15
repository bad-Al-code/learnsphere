'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface EnrollmentChartProps {
  data: {
    month: string;
    revenue: number;
    enrollments: number;
  }[];
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
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
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
          }}
          labelStyle={{
            color: 'hsl(var(--foreground))',
          }}
          itemStyle={{
            color: 'hsl(var(--foreground))',
          }}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar
          dataKey="enrollments"
          fill="hsl(var(--secondary))"
          radius={[4, 4, 0, 0]}
          activeBar={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EnrollmentChartSkeleton() {
  return (
    <div className="flex h-[350px] w-full flex-col justify-end space-y-2">
      <div className="flex h-full items-end justify-between gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-md"
            style={{
              height: `${40 + Math.random() * 200}px`,
            }}
          />
        ))}
      </div>

      <Skeleton className="h-4 w-full" />
    </div>
  );
}
