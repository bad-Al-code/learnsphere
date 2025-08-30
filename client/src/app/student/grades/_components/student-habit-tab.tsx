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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const habitsChartData = [
  { day: 'Monday', efficiency: 88, focus: 82 },
  { day: 'Tuesday', efficiency: 90, focus: 85 },
  { day: 'Wednesday', efficiency: 82, focus: 78 },
  { day: 'Thursday', efficiency: 85, focus: 80 },
  { day: 'Friday', efficiency: 80, focus: 75 },
  { day: 'Saturday', efficiency: 88, focus: 82 },
  { day: 'Sunday', efficiency: 86, focus: 80 },
];

const habitsChartConfig = {
  efficiency: { label: 'Efficiency %', color: 'hsl(160 70% 40%)' },
  focus: { label: 'Focus Time %', color: 'hsl(160 50% 55%)' },
} satisfies ChartConfig;

const efficiencyChartData = [
  { subject: 'React', application: 90, comprehension: 25, retention: 62 },
  { subject: 'Python', application: 58, comprehension: 45, retention: 90 },
  { subject: 'UI/UX', application: 25, comprehension: 90, retention: 55 },
];

const efficiencyChartConfig = {
  application: { label: 'Application', color: 'hsl(40 90% 60%)' },
  comprehension: { label: 'Comprehension', color: 'hsl(210 90% 60%)' },
  retention: { label: 'Retention', color: 'hsl(160 70% 40%)' },
} satisfies ChartConfig;

const timeManagementData = [
  { activity: 'Lectures', planned: 20, actual: 18, progress: 90 },
  { activity: 'Assignments', planned: 15, actual: 22, progress: 68 },
  { activity: 'Study Groups', planned: 8, actual: 6, progress: 75 },
  { activity: 'Practice', planned: 12, actual: 14, progress: 117 },
  { activity: 'Review', planned: 5, actual: 3, progress: 60 },
];

function StudyHabitsAnalysisChart() {
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
      <CardContent>
        <ChartContainer config={habitsChartConfig} className="h-[250px] w-full">
          <AreaChart accessibilityLayer data={habitsChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
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
      </CardContent>
    </Card>
  );
}

function LearningEfficiencyChart() {
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
      <CardContent className="pb-0">
        <ChartContainer
          config={efficiencyChartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadarChart data={efficiencyChartData}>
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
            />
            <Radar
              dataKey="comprehension"
              fill="var(--color-comprehension)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="retention"
              fill="var(--color-retention)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TimeManagement() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <CardTitle>Time Management</CardTitle>
        </div>
        <CardDescription>Planned vs actual time allocation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {timeManagementData.map((item) => (
          <div key={item.activity}>
            <div className="mb-1 flex items-center justify-between">
              <p className="font-semibold">{item.activity}</p>
              <Badge variant={item.progress < 70 ? 'destructive' : 'secondary'}>
                {item.progress}%
              </Badge>
            </div>
            <p className="text-muted-foreground mb-1 text-xs">
              Planned: {item.planned}h • Actual: {item.actual}h
            </p>
            <Progress value={item.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StudyHabitsAnalysisChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function LearningEfficiencyChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mx-auto aspect-square h-[250px] rounded-full" />
      </CardContent>
    </Card>
  );
}

function TimeManagementSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
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
    </Card>
  );
}

export function StudyHabitsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <StudyHabitsAnalysisChart />
      </div>
      <LearningEfficiencyChart />
      <TimeManagement />
    </div>
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
