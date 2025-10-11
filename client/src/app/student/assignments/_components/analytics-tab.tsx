'use client';

import { Button } from '@/components/ui/button';
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
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  BarChart2,
  Clock,
  FileText,
  Lightbulb,
  RefreshCw,
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
import { useAssignmentAnalytics } from '../hooks/use-analytics';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  BarChart2,
  Clock,
  Users,
  TrendingUp,
  Lightbulb,
  Zap,
};

function StatCard({
  stat,
}: {
  stat: {
    title: string;
    value: string;
    change?: string;
    description?: string;
    Icon?: string;
  };
}) {
  const StatIcon = stat.Icon ? iconMap[stat.Icon] : FileText;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <StatIcon className="text-muted-foreground h-4 w-4" />
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

function SubmissionTrendsChart({
  data,
  config,
}: {
  data: any[];
  config: ChartConfig;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Submission Trends</CardTitle>
        <CardDescription>
          Your submission and grading patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart accessibilityLayer data={data}>
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

function GradeDistributionChart({
  data,
  config,
}: {
  data: any[];
  config: ChartConfig;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Breakdown of your assignment grades</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={config} className="mx-auto aspect-square h-64">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
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
  insight: {
    title: string;
    text: string;
    Icon: string;
    color: string;
  };
}) {
  const InsightIcon = iconMap[insight.Icon] || Lightbulb;
  return (
    <div
      className={`flex items-start gap-4 rounded-lg border p-4 ${insight.color}`}
    >
      <InsightIcon className="mt-1 h-5 w-5 flex-shrink-0" />
      <div className="flex-grow">
        <h4 className="font-semibold">{insight.title}</h4>
        <p className="text-sm opacity-90">{insight.text}</p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center justify-center p-12 text-center">
      <AlertCircle className="text-destructive h-12 w-12" />
      <div className="">
        <h3 className="text-xl font-semibold">Error</h3>
        <p className="text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant={'outline'} onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </Card>
  );
}

export function AnalyticsTab({ courseId }: { courseId?: string }) {
  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  const { data, isLoading, isError, refetch } =
    useAssignmentAnalytics(courseId);

  if (isLoading) {
    return <AnalyticsTabSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load assignment analytics."
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return (
      <ErrorState message="No analytics data available." onRetry={refetch} />
    );
  }

  const trendsConfig = {
    submissions: { label: 'Submissions', color: 'var(--chart-1)' },
    grade: { label: 'Avg. Grade', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  const gradesConfig = data.gradeDistribution.reduce(
    (acc, item) => {
      acc[
        item.grade.toLowerCase().replace('+', '-plus').replace('-', '-minus')
      ] = {
        label: item.grade,
        color: item.fill,
      };
      return acc;
    },
    { value: { label: 'Grades' } } as ChartConfig
  );

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <SubmissionTrendsChart data={data.trends} config={trendsConfig} />
        <GradeDistributionChart
          data={data.gradeDistribution}
          config={gradesConfig}
        />
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
          {data.insights.map((insight) => (
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
