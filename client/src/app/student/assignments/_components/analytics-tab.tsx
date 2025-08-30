'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart2,
  Clock,
  FileText,
  Lightbulb,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

const statsData = [
  { title: 'Total Submitted', value: '40', change: '+12%', Icon: FileText },
  { title: 'Average Grade', value: '88.5%', change: '+2.1%', Icon: BarChart2 },
  {
    title: 'On-Time Rate',
    value: '95%',
    description: '38 of 40 assignments',
    Icon: Clock,
  },
  {
    title: 'Peer Reviews',
    value: '23',
    description: 'Reviews completed',
    Icon: Users,
  },
];

const trendsData = [
  { month: 'Sep', submissions: 8, grade: 9.5 },
  { month: 'Oct', submissions: 11.5, grade: 12 },
  { month: 'Nov', submissions: 10, grade: 10.5 },
  { month: 'Dec', submissions: 7, grade: 8 },
  { month: 'Jan', submissions: 5, grade: 2.5 },
];

const trendsConfig = {
  submissions: { label: 'Submissions', color: 'var(--chart0)' },
  grade: { label: 'Avg. Grade', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const gradesData = [
  { grade: 'A', value: 12, fill: 'var(--color-a)' },
  { grade: 'A+', value: 8, fill: 'var(--color-a-plus)' },
  { grade: 'A-', value: 6, fill: 'var(--color-a-minus)' },
  { grade: 'B+', value: 3, fill: 'var(--color-b-plus)' },
  { grade: 'B', value: 1, fill: 'var(--color-b)' },
];

const gradesConfig = {
  value: { label: 'Grades' },
  a: { label: 'A', color: 'var(--chart-1)' },
  'a-plus': { label: 'A+', color: 'var(--chart-2)' },
  'a-minus': { label: 'A-', color: 'var(--chart-3)' },
  'b-plus': { label: 'B+', color: 'var(--chart-4)' },
  b: { label: 'B', color: 'var(--chart-5)' },
} satisfies ChartConfig;
const insightsData = [
  {
    title: 'Strong Performance Trend',
    text: 'Your grades have improved by 8% over the last 3 months. Keep up the excellent work!',
    Icon: TrendingUp,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Improvement Opportunity',
    text: 'Consider starting assignments earlier. Your best grades come from submissions made 2+ days before the deadline.',
    Icon: Lightbulb,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Peer Review Excellence',
    text: 'Your peer reviews are consistently rated as helpful. This collaborative approach enhances learning for everyone.',
    Icon: Users,
    color: 'bg-purple-500/10 text-purple-500',
  },
];

function StatCard({ stat }: { stat: (typeof statsData)[0] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <stat.Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className="text-muted-foreground text-xs">
          {stat.change || stat.description}
        </p>
      </CardContent>
    </Card>
  );
}

function SubmissionTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Submission Trends</CardTitle>
        <CardDescription>
          Your submission and grading patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendsConfig} className="h-64 w-full">
          <LineChart accessibilityLayer data={trendsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} ticks={[0, 3, 6, 9, 12]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="submissions"
              type="natural"
              stroke="var(--color-submissions)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-submissions)' }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="grade"
              type="natural"
              stroke="var(--color-grade)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-grade)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GradeDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Breakdown of your assignment grades</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={gradesConfig}
          className="mx-auto aspect-square h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={gradesData}
              dataKey="value"
              nameKey="grade"
              label={({ payload, ...props }) => (
                <text
                  {...props}
                  className="fill-muted-foreground text-xs"
                >{`${payload.grade}: ${payload.value}`}</text>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function PerformanceInsightItem({
  insight,
}: {
  insight: (typeof insightsData)[0];
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-lg border p-4 ${insight.color}`}
    >
      <insight.Icon className="mt-1 h-5 w-5 flex-shrink-0" />
      <div className="flex-grow">
        <h4 className="font-semibold">{insight.title}</h4>
        <p className="text-sm opacity-90">{insight.text}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-7 w-16" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function PerformanceInsightItemSkeleton() {
  return <Skeleton className="h-20 w-full rounded-lg" />;
}

export function AnalyticsTab() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <SubmissionTrendsChart />
        <GradeDistributionChart />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Performance Insights</CardTitle>
          </div>
          <CardDescription>
            AI-powered analysis of your assignment performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {insightsData.map((insight) => (
            <PerformanceInsightItem key={insight.title} insight={insight} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-2">
          <PerformanceInsightItemSkeleton />
          <PerformanceInsightItemSkeleton />
          <PerformanceInsightItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
