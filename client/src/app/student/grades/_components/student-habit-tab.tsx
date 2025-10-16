'use client';

import { Clock, Timer, Zap } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
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
import { ErrorState } from '@/components/ui/error-state';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useLearningEfficiency,
  useStudyHabits,
  useTimeManagement,
} from '../hooks';

const habitsChartConfig = {
  efficiency: { label: 'Efficiency %', color: 'hsl(160 70% 40%)' },
  focus: { label: 'Focus Time %', color: 'hsl(160 50% 55%)' },
} satisfies ChartConfig;

function StudyHabitsAnalysisChart() {
  const { data, isLoading, isError, error, refetch } = useStudyHabits();

  const renderContent = () => {
    if (isLoading) {
      return <StudyHabitsAnalysisChartSkeleton />;
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full flex-col items-center justify-center text-center text-sm">
          <Clock className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-semibold">No Study Habits Data</p>
          <p>Start and end some lesson sessions to analyze your habits.</p>
        </div>
      );
    }

    return (
      <ChartContainer config={habitsChartConfig} className="h-64 w-full">
        <AreaChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillEfficiency" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-efficiency)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-efficiency)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillFocus" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-focus)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-focus)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="efficiency"
            type="natural"
            fill="url(#fillEfficiency)"
            stroke="var(--color-efficiency)"
          />
          <Area
            dataKey="focus"
            type="natural"
            fill="url(#fillFocus)"
            stroke="var(--color-focus)"
          />
        </AreaChart>
      </ChartContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle>Study Habits Analysis</CardTitle>
        </div>
        <CardDescription>
          Detailed analysis of your study patterns and efficiency
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function LearningEfficiencyChart() {
  const { data, isLoading, isError, error, refetch } = useLearningEfficiency();

  const chartConfig = {
    application: { label: 'Application', color: 'hsl(40 90% 60%)' },
    comprehension: { label: 'Comprehension', color: 'hsl(210 90% 60%)' },
    retention: { label: 'Retention', color: 'hsl(160 70% 40%)' },
  } satisfies ChartConfig;

  const renderContent = () => {
    if (isLoading) {
      return <LearningEfficiencyChartSkeleton />;
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full flex-col items-center justify-center text-center text-sm">
          <Zap className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-semibold">Not Enough Data for Analysis</p>
          <p>
            Complete assignments in different subjects to see your efficiency.
          </p>
        </div>
      );
    }

    return (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-64"
      >
        <RadarChart data={data}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <PolarAngleAxis dataKey="subject" />
          <PolarGrid />
          <Radar
            dataKey="application"
            fill="var(--color-application)"
            fillOpacity={0.6}
            stroke="var(--color-application)"
          />
          <Radar
            dataKey="comprehension"
            fill="var(--color-comprehension)"
            fillOpacity={0.6}
            stroke="var(--color-comprehension)"
          />
          <Radar
            dataKey="retention"
            fill="var(--color-retention)"
            fillOpacity={0.6}
            stroke="var(--color-retention)"
          />
        </RadarChart>
      </ChartContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <CardTitle>Learning Efficiency</CardTitle>
        </div>
        <CardDescription>
          Comprehension, retention, and application by subject
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">{renderContent()}</CardContent>
    </Card>
  );
}

function TimeManagement() {
  const { data, isLoading, isError, error, refetch } = useTimeManagement();

  const renderContent = () => {
    if (isLoading) {
      return <TimeManagementSkeleton />;
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full items-center justify-center text-center text-sm">
          <p>
            Set study goals and log study sessions to see your time management
            stats.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.activity}>
            <div className="mb-1 flex items-center justify-between">
              <p className="font-semibold">{item.activity}</p>
              <Badge variant={item.progress < 70 ? 'destructive' : 'secondary'}>
                {item.progress}%
              </Badge>
            </div>
            <p className="text-muted-foreground mb-1 text-xs">
              Planned: {item.planned}h • Actual: {item.actual.toFixed(1)}h
            </p>
            <Progress value={item.progress} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <CardTitle>Time Management</CardTitle>
        </div>
        <CardDescription>Planned vs actual time allocation</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

export function StudyHabitsTab() {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <StudyHabitsAnalysisChart />
        </div>
        <LearningEfficiencyChart />
        <TimeManagement />
      </div>
    </>
  );
}

export function StudyHabitsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <StudyHabitsAnalysisChartSkeleton />
      </div>
      <LearningEfficiencyChartSkeleton />
      <TimeManagementSkeleton />
    </div>
  );
}

function StudyHabitsAnalysisChartSkeleton() {
  return (
    <CardContent>
      <Skeleton className="h-48 w-full" />
    </CardContent>
  );
}

function LearningEfficiencyChartSkeleton() {
  return (
    <CardContent>
      <Skeleton className="mx-auto aspect-square h-48 rounded-full" />
    </CardContent>
  );
}

function TimeManagementSkeleton() {
  return (
    <CardContent className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </CardContent>
  );
}
