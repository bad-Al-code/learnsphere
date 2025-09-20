'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from 'date-fns';
import { FC } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAIInsights, useStudyTimeTrend } from '../hooks/use-insights';

type TInsightCardProps = {
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  actionButton: React.ReactNode;
  icon: React.ReactNode;
};

type TAIStudyAssistantProps = {
  onAsk: (query: string) => void;
};

export const InsightCard: FC<TInsightCardProps> = ({
  title,
  level,
  description,
  actionButton,
  icon,
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              level === 'high'
                ? 'bg-green-500/10 text-green-500'
                : level === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-red-500/10 text-red-500'
            }`}
          >
            {level}
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="mt-4">{actionButton}</div>
    </CardContent>
  </Card>
);

type TStudyData = {
  day: string;
  hours: number;
};

type TStudyTimeTrendProps = {
  data: TStudyData[];
};

const chartConfig = {
  hours: {
    label: 'Hours',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const formatHours = (decimalHours: number) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  const duration = { hours, minutes };
  return formatDuration(duration, { format: ['hours', 'minutes'] });
};

export const StudyTimeTrend: FC<TStudyTimeTrendProps> = ({ data }) => {
  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);
  const avgHours = totalHours / data.length;

  const totalHoursFormatted = formatHours(totalHours);
  const avgHoursFormatted = formatHours(avgHours);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Time Trend</CardTitle>
        <p className="text-muted-foreground text-sm">
          Your daily study hours this week
        </p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="bg-primary h-2 w-2 animate-pulse rounded-full"></div>
            <span className="text-muted-foreground">Total: </span>
            <span className="text-foreground font-semibold">
              {totalHoursFormatted}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-muted h-2 w-2 rounded-full"></div>
            <span className="text-muted-foreground">Avg: </span>
            <span className="text-foreground font-semibold">
              {avgHoursFormatted}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={[0, 8]}
              ticks={[0, 4, 8]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Line
              dataKey="hours"
              type="monotone"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeDasharray="2 8"
              dot={{
                fill: 'bg-muted',
                r: 4,
              }}
              activeDot={{
                r: 4,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const InsightCardSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-4 h-10 w-32" />
    </CardContent>
  </Card>
);

export const StudyTimeTrendSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-2 h-4 w-48" />
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="bg-muted h-2 w-2 animate-pulse rounded-full" />
          <Skeleton className="bg-muted h-4 w-16 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="bg-muted h-2 w-2 animate-pulse rounded-full" />
          <Skeleton className="bg-muted h-4 w-16 animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-40 w-full" />
    </CardContent>
  </Card>
);

export function InsightTab() {
  const { data: insights, isLoading: isLoadingInsights } = useAIInsights();
  const { data: studyTimeData, isLoading: isLoadingTrend } =
    useStudyTimeTrend();

  const insightIcons: Record<string, React.ReactNode> = {
    high: <span>🚀</span>,
    medium: <span>🕒</span>,
    low: <span>👥</span>,
  };

  return (
    <div className="">
      <Card>
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-bold">AI Insights Feed</h1>
          <p className="text-muted-foreground">
            Personalized notifications and recommendations
          </p>

          <div className="space-y-2">
            {isLoadingInsights ? (
              <>
                <InsightCardSkeleton />
                <InsightCardSkeleton />
              </>
            ) : (
              insights?.map((insight) => (
                <InsightCard
                  key={insight.title}
                  title={insight.title}
                  level={insight.level}
                  description={insight.description}
                  actionButton={<Button>{insight.actionButtonText}</Button>}
                  icon={insightIcons[insight.level]}
                />
              ))
            )}
          </div>

          <div className="">
            {isLoadingTrend ? (
              <StudyTimeTrendSkeleton />
            ) : (
              <StudyTimeTrend data={studyTimeData || []} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InsightsTabSkeleton() {
  return (
    <Card className="space-y-2">
      <CardContent className="space-y-2">
        <InsightCardSkeleton />
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <StudyTimeTrendSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}
