'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from '@/lib/utils';
import {
  BarChart,
  CheckCircle2,
  Circle,
  CircleDot,
  Map,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

const trendData = [
  { week: 'Week 1', studyHours: 12, target: 15 },
  { week: 'Week 2', studyHours: 18, target: 13 },
  { week: 'Week 3', studyHours: 16, target: 16 },
  { week: 'Week 4', studyHours: 22, target: 3 },
  { week: 'Week 5', studyHours: 18, target: 20 },
  { week: 'Week 6', studyHours: 20, target: 23 },
  { week: 'Week 7', studyHours: 20, target: 0 },
  { week: 'Week 8', studyHours: 24, target: 28 },
];

const trendConfig = {
  studyHours: { label: 'Study Hours', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const completionData = [
  { status: 'Completed', value: 68, fill: 'var(--color-chart-1)' },
  { status: 'In Progress', value: 22, fill: 'var(--color-chart-2)' },
  { status: 'Not Started', value: 10, fill: 'var(--color-chart-4)' },
];

const completionConfig = {
  completed: { label: 'Completed', color: 'var(--chart-1)' },
  inProgress: { label: 'In Progress', color: 'var(--chart-2)' },
  notStarted: { label: 'Not Started', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const insightsData = [
  {
    title: 'Study Pace Analysis',
    description:
      "If you maintain 2 hours daily, you'll complete React Fundamentals by January 25th.",
  },
  {
    title: 'Performance Trend',
    description:
      'Your grades have improved by 8% over the last month. Keep up the excellent work!',
  },
  {
    title: 'Focus Recommendation',
    description:
      "Consider spending more time on Database Design - it's your most challenging subject.",
  },
];

type MilestoneStatus = 'completed' | 'in-progress' | 'upcoming';

interface Milestone {
  title: string;
  date: string;
  status: MilestoneStatus;
}

const milestonesData: Milestone[] = [
  { title: 'JavaScript Fundamentals', date: '2023-11-15', status: 'completed' },
  { title: 'React Basics', date: '2023-12-20', status: 'completed' },
  { title: 'Database Design', date: '2024-01-15', status: 'in-progress' },
  { title: 'Full-Stack Project', date: '2024-02-28', status: 'upcoming' },
  { title: 'Portfolio Completion', date: '2024-03-15', status: 'upcoming' },
];

function StudyTimeTrend() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <CardTitle>Study Time Trend</CardTitle>
        </div>
        <CardDescription>
          Your weekly study hours compared to your target
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="h-64 w-full">
          <LineChart accessibilityLayer data={trendData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 28]}
              ticks={[0, 7, 14, 21, 28]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="studyHours"
              type="natural"
              stroke="var(--color-studyHours)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-studyHours)' }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="target"
              stroke="var(--color-target)"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ModuleCompletion() {
  const totalCompleted =
    completionData.find((d) => d.status === 'Completed')?.value || 0;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <CardTitle>Module Completion</CardTitle>
        </div>
        <CardDescription>Overall progress across all courses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={completionConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={completionData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCompleted}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Completed
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-muted-foreground mx-auto space-x-2 text-sm">
        {completionData.map((item) => (
          <span
            key={item.status}
            className="flex items-center justify-center gap-1.5 leading-none"
          >
            <span
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: item.fill }}
            />
            {item.status}: {item.value}%
          </span>
        ))}
      </CardFooter>
    </Card>
  );
}

function AIProgressInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <CardTitle>AI Progress Insights</CardTitle>
        </div>
        <CardDescription>
          Personalized recommendations based on your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {insightsData.map((insight) => (
          <div
            key={insight.title}
            className="bg-muted/50 rounded-lg border p-3"
          >
            <h4 className="text-sm font-semibold">{insight.title}</h4>
            <p className="text-muted-foreground text-sm">
              {insight.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LearningMilestones() {
  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    'in-progress': <CircleDot className="text-primary h-4 w-4 animate-pulse" />,
    upcoming: <Circle className="text-muted-foreground h-4 w-4" />,
  };
  const statusBadges = {
    completed: <Badge>completed</Badge>,
    'in-progress': <Badge variant="secondary">In Progress</Badge>,
    upcoming: <Badge variant="outline">upcoming</Badge>,
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          <CardTitle>Learning Milestones</CardTitle>
        </div>
        <CardDescription>Your learning journey timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {milestonesData.map((milestone, i) => (
          <div key={milestone.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  milestone.status === 'in-progress' && 'bg-primary/20'
                )}
              >
                {statusIcons[milestone.status]}
              </div>
              {i < milestonesData.length - 1 && (
                <div className="bg-border my-1 h-full w-px" />
              )}
            </div>
            <div className="flex flex-grow items-center justify-between pb-4">
              <div className="flex-grow">
                <p className="font-semibold">{milestone.title}</p>
                <p className="text-muted-foreground text-xs">
                  {milestone.date}
                </p>
              </div>
              {statusBadges[milestone.status]}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton({
  titleWidth = 'w-56',
  descWidth = 'w-64',
}: {
  titleWidth?: string;
  descWidth?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className={`h-6 ${titleWidth}`} />
        <Skeleton className={`h-4 ${descWidth} mt-2`} />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function AIProgressInsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full rounded-lg border" />
        <Skeleton className="h-16 w-full rounded-lg border" />
        <Skeleton className="h-16 w-full rounded-lg border" />
      </CardContent>
    </Card>
  );
}

function LearningMilestonesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="pb- flex flex-grow items-center justify-between">
              <div className="space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProgressTab() {
  return (
    <div className="space-y-2">
      <StudyTimeTrend />
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        <ModuleCompletion />
        <AIProgressInsights />
      </div>
      <LearningMilestones />
    </div>
  );
}

export function ProgressTabSkeleton() {
  return (
    <div className="space-y-2">
      <ChartCardSkeleton titleWidth="w-48" descWidth="w-64" />
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        <ChartCardSkeleton titleWidth="w-40" descWidth="w-56" />
        <AIProgressInsightsSkeleton />
      </div>
      <LearningMilestonesSkeleton />
    </div>
  );
}
