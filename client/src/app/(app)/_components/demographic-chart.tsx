'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DemographicsChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function DemographicsChart({ data }: DemographicsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={120}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DemographicsChartSkeleton() {
  return (
    <div className="flex h-[350px] flex-col items-center justify-center gap-4">
      <Skeleton className="h-[200px] w-[200px] rounded-full" />
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
