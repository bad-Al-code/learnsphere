'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CoursePerformanceChartProps {
  data: {
    name: string;
    completionRate: number;
    students: number;
    rating: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completion = payload.find((p: any) => p.dataKey === 'completionRate');
    const students = payload.find((p: any) => p.dataKey === 'students');
    const rating = payload.find((p: any) => p.dataKey === 'rating');

    return (
      <div className="bg-background rounded-md border p-2 shadow-sm">
        <p className="font-bold">{label}</p>
        {completion && (
          <p className="text-sm text-blue-500">
            Completion Rate: {completion.value}%
          </p>
        )}
        {students && (
          <p className="text-sm text-purple-500">Students: {students.value}</p>
        )}
        {rating && (
          <p className="text-sm text-green-500">
            Rating: {rating.value.toFixed(1)} / 5
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function CoursePerformanceChart({ data }: CoursePerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
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
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="completionRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function CoursePerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent className="flex h-[350px] items-center justify-center">
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}
