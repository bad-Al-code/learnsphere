'use client';

import { Award, ListOrdered, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/features/ai-tools/_components/common/CourseSelectionScrren';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { useComparisonAnalytics, usePerformanceHighlights } from '../hooks';

const chartData = [
  { subject: 'React', yourScore: 98, classAverage: 82 },
  { subject: 'Database', yourScore: 95, classAverage: 88 },
  { subject: 'UI/UX', yourScore: 95, classAverage: 85 },
  { subject: 'Python', yourScore: 92, classAverage: 84 },
];

const chartConfig = {
  yourScore: { label: 'Your Score', color: 'var(--chart-1)' },
  classAverage: { label: 'Class Average', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const rankingData = [
  { rank: 1, name: 'Anonymous Student', score: 96 },
  { rank: 2, name: 'Anonymous Student', score: 94 },
  { rank: 3, name: 'You', score: 90, isUser: true },
  { rank: 4, name: 'Anonymous Student', score: 88 },
  { rank: 5, name: 'Anonymous Student', score: 86 },
];

function PerformanceChart({
  data,
}: {
  data: { subject: string; yourScore: number; classAverage: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>Performance vs Class Average</CardTitle>
        </div>
        <CardDescription>
          See how you're performing compared to your peers across courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="subject"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
              />
              <YAxis domain={[0, 100]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="yourScore"
                fill="var(--color-yourScore)"
                radius={4}
              />
              <Bar
                dataKey="classAverage"
                fill="var(--color-classAverage)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex h-[250px] w-full items-center justify-center text-center text-sm">
            <p>Not enough grade data available to display performance chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClassRanking({
  rankingData,
  currentUserId,
}: {
  rankingData: {
    rank: number | null;
    totalStudents: number;
    topStudents: { rank: number; name: string; score: number }[];
  };
  currentUserId: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5" />
          <CardTitle>Class Ranking</CardTitle>
        </div>
        <CardDescription>
          Your position among {rankingData.totalStudents} students in this
          course
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rankingData.topStudents.length > 0 ? (
          <div className="space-y-2">
            {rankingData.topStudents.map((player) => (
              <div
                key={player.rank}
                className={cn(
                  'hover:bg-muted/30 flex items-center gap-2 rounded-md border p-2',
                  player.name === 'You' && 'bg-muted hover:bg-muted'
                )}
              >
                <span className="text-muted-foreground w-4 text-right text-sm">
                  {player.rank}
                </span>
                <p className="flex-1 font-medium">{player.name}</p>
                <p className="text-sm font-semibold">
                  {player.score.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground flex h-[150px] w-full items-center justify-center text-center text-sm">
            <p>No ranking data available for this course yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceHighlights({ courseId }: { courseId: string }) {
  const { data, isLoading, isError, error, refetch } =
    usePerformanceHighlights(courseId);

  if (isLoading) {
    return <PerformanceHighlightsSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <CardTitle>Performance Highlights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ErrorState message={error.message} onRetry={refetch} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <CardTitle>Performance Highlights</CardTitle>
        </div>
        <CardDescription>AI-powered analysis of your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.map((highlight) => (
          <div key={highlight.title}>
            <h4 className="text-muted-foreground text-sm font-semibold">
              {highlight.title}
            </h4>
            <p className="text-sm">{highlight.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ComparisonTab({ courseId }: { courseId: string }) {
  const { user } = useSessionStore();
  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch,
  } = useComparisonAnalytics(courseId);

  if (isLoading) {
    return <ComparisonTabSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!analytics) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <p>No comparison data available for this course yet.</p>
      </div>
    );
  }

  const rankingDataWithUser = {
    ...analytics.classRanking,
    topStudents: analytics.classRanking.topStudents.map((student) =>
      student.rank === analytics.classRanking.rank
        ? { ...student, name: 'You' }
        : student
    ),
  };

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PerformanceChart data={analytics.performanceChart} />
      </div>
      <ClassRanking
        rankingData={rankingDataWithUser}
        currentUserId={user!.userId}
      />

      <PerformanceHighlights courseId={courseId} />
    </div>
  );
}
export function ComparisonTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PerformanceChartSkeleton />
      </div>
      <ClassRankingSkeleton />
      <PerformanceHighlightsSkeleton />
    </div>
  );
}

function PerformanceChartSkeleton() {
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

function ClassRankingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg">
            <Skeleton className="h-5 w-4" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PerformanceHighlightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="bg-muted space-y-2 rounded-md p-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
