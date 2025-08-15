'use client';

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
      payload.find((p: any) => p.dataKey === 'revenue')?.value ?? 0;
    const expenses =
      payload.find((p: any) => p.dataKey === 'expenses')?.value ?? 0;
    const profit = payload.find((p: any) => p.dataKey === 'profit')?.value ?? 0;

    return (
      <div className="bg-background rounded-md border p-2 shadow-sm">
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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend iconType="circle" iconSize={10} />
        <Bar
          dataKey="revenue"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="hsl(var(--destructive))"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
