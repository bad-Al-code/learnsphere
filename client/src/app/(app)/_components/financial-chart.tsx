'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue =
      payload.find((p: any) => p.dataKey === 'revenue')?.value ?? 1;
    const expenses =
      payload.find((p: any) => p.dataKey === 'expenses')?.value ?? 1;
    const profit = payload.find((p: any) => p.dataKey === 'profit')?.value ?? 1;

    return (
      <div className="bg-background rounded-md border p-1 shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-sky-500">
          Revenue: ${revenue.toLocaleString()}
        </p>
        <p className="text-sm text-rose-500">
          Expenses: ${expenses.toLocaleString()}
        </p>
        <p className="text-sm text-emerald-500">
          Profit: ${profit.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ResponsiveContainer width="101%" height={350}>
      <BarChart data={data}>
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
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend iconType="circle" iconSize={11} />
        <Bar
          dataKey="revenue"
          fill="hsl(var(--primary))"
          radius={[5, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="hsl(var(--destructive))"
          radius={[5, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="hsl(var(--chart-1))"
          strokeWidth={3}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FinancialChartSkeleton() {
  return (
    <div className="flex h-[350px] w-full flex-col justify-end gap-2 p-4">
      <Skeleton className="mb-2 h-4 w-24" /> {/* chart title placeholder */}
      <div className="flex h-full items-end gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[60%] w-8 rounded-sm md:w-10"
            style={{ height: `${40 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}
