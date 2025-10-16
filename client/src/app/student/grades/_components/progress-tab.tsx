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
import { ErrorState } from '@/components/ui/error-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Book,
  Calendar,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardCheck,
  Map,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  useAIProgressInsights,
  useLearningMilestones,
  useModuleCompletion,
  useStudyTimeTrend,
} from '../hooks';
import { StudyTimeTrend as StudyTimeTrendSchema } from '../schema';
import { StudyHabitsTab, StudyHabitsTabSkeleton } from './student-habit-tab';

const trendConfig = {
  studyHours: { label: 'Study Hours', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
} satisfies ChartConfig;

type AggregatedWeek = {
  week: string;
  studyHours: number;
  count: number;
  target: number;
};

function StudyTimeTrend() {
  const { data, isLoading, isError, error, refetch } = useStudyTimeTrend();

  const prepareData = (rawData: StudyTimeTrendSchema[] | undefined) => {
    if (!rawData || rawData.length === 0) return [];

    const numericData = rawData.map((item) => ({
      ...item,
      studyHours: Number(item.studyHours),
      target: Number(item.target),
    }));

    const aggregated = Object.values(
      numericData.reduce<Record<string, AggregatedWeek>>(
        (acc, { week, studyHours, target }) => {
          if (!acc[week]) acc[week] = { week, studyHours: 0, count: 0, target };
          acc[week].studyHours += studyHours;
          acc[week].count++;
          return acc;
        },
        {}
      )
    ).map((w) => ({
      week: w.week,
      studyHours: w.studyHours / w.count,
      target: w.target,
    }));

    return aggregated;
  };

  const chartData = prepareData(data);

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-48 w-full" />;
    }

    if (isError) {
      return (
        <div className="">
          <ErrorState message={error.message} onRetry={refetch} />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full flex-col items-center justify-center text-center text-sm">
          <BarChart className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-semibold">No Study Data Available</p>
          <p>Start and end lesson sessions to see your study trend.</p>
        </div>
      );
    }

    return (
      <ChartContainer config={trendConfig} className="h-48 w-full">
        <LineChart accessibilityLayer data={chartData}>
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
            domain={[0, 'dataMax + 5']}
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
    );
  };
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
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function ModuleCompletion() {
  const { data, isLoading, isError, error, refetch } = useModuleCompletion();

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="mx-auto h-48 w-48 rounded-full" />;
    }

    if (isError) {
      return (
        <div className="">
          <ErrorState message={error.message} onRetry={refetch} />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full flex-col items-center justify-center text-center text-sm">
          <CheckCircle2 className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-semibold">No Module Data Available</p>
          <p>Start a course to see your completion progress.</p>
        </div>
      );
    }

    const totalCompletedValue =
      data.find((d) => d.status === 'Completed')?.value || 0;

    const completionConfig = data.reduce((acc, cur) => {
      acc[cur.status.replace(' ', '')] = { label: cur.status, color: cur.fill };
      return acc;
    }, {} as ChartConfig);

    return (
      <>
        <ChartContainer config={completionConfig} className="max-h-48">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
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
                          {`${totalCompletedValue}%`}
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

        <CardFooter className="text-muted-foreground flex items-center justify-center gap-4">
          {data.map((item) => (
            <div key={item.status} className="flex items-center gap-1.5">
              <span
                className="mb-1 h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.status}</span>
            </div>
          ))}
        </CardFooter>
      </>
    );
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <CardTitle>Module Completion</CardTitle>
        </div>
        <CardDescription>Overall progress across all courses</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center pb-0">
        {renderContent()}
        {/* <ChartContainer
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
        </ChartContainer> */}
      </CardContent>
      {/* <CardFooter className="text-muted-foreground mx-auto space-x-2 text-sm">
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
      </CardFooter> */}
    </Card>
  );
}

function AIProgressInsights() {
  const { data, isLoading, isError, error, refetch } = useAIProgressInsights();

  const renderContent = () => {
    if (isLoading) {
      return <AIProgressInsightsSkeleton />;
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full items-center justify-center text-center text-sm">
          <p>No AI insights available at this time.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {data.map((insight) => (
          <div
            key={insight.title}
            className={cn('bg-muted/30 rounded-lg border p-3')}
          >
            <h4 className="text-sm font-semibold">{insight.title}</h4>
            <p className="text-muted-foreground text-sm">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

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
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function LearningMilestones() {
  const { data, isLoading, isError, error, refetch } = useLearningMilestones();

  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    'in-progress': <CircleDot className="text-primary h-4 w-4 animate-pulse" />,
    upcoming: <Circle className="text-muted-foreground h-4 w-4" />,
  };

  const typeIcons = {
    course: <Book className="h-4 w-4" />,
    assignment: <ClipboardCheck className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />,
  };

  const statusBadges = {
    completed: <Badge>Completed</Badge>,
    'in-progress': <Badge variant="secondary">In Progress</Badge>,
    upcoming: <Badge variant="outline">Upcoming</Badge>,
  };

  const renderContent = () => {
    if (isLoading) {
      return <LearningMilestonesSkeleton />;
    }

    if (isError) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-[200px] items-center justify-center text-center text-sm">
          <p>Your learning milestones will appear here as you progress.</p>
        </div>
      );
    }

    return (
      <>
        {data.map((milestone, i) => (
          <div key={`${milestone.title}-${i}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'bg-muted flex h-8 w-8 items-center justify-center rounded-full',
                  milestone.status === 'in-progress' && 'bg-primary/20'
                )}
              >
                {typeIcons[milestone.type]}
              </div>
              {i < data.length - 1 && (
                <div className="bg-border my-1 h-full w-px" />
              )}
            </div>
            <div className="flex flex-grow items-center justify-between pb-6">
              <div className="flex-grow">
                <p className="font-semibold">{milestone.title}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(milestone.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {statusBadges[milestone.status]}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <Card className="">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          <CardTitle>Learning Milestones</CardTitle>
        </div>
        <CardDescription>Your learning journey timeline</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="">
          <div className="mr-3 max-h-[50vh]">{renderContent()}</div>
        </ScrollArea>
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

      <StudyHabitsTab />
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

      <StudyHabitsTabSkeleton />
    </div>
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
