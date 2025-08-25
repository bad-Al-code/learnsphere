'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface PerformanceStat {
  title: string;
  value: string;
  change: number;
  changePrefix?: string;
  changeSuffix?: string;
  target: string;
}

interface MiniPerformanceMetricsProps {
  data?: PerformanceStat[];
}

const placeholderData: PerformanceStat[] = [
  {
    title: 'Course Completion Rate',
    value: '78%',
    change: 5,
    changeSuffix: '%',
    target: '80%',
  },
  {
    title: 'Student Satisfaction',
    value: '4.6/5',
    change: 0.2,
    target: '4.5/5',
  },
  { title: 'Average Grade', value: 'B+', change: 0.3, target: 'B+' },
  {
    title: 'Engagement Score',
    value: '85%',
    change: 8,
    changeSuffix: '%',
    target: '80%',
  },
];

function PerformanceStatCard({
  title,
  value,
  change,
  changePrefix = '',
  changeSuffix = '',
  target,
}: PerformanceStat) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <TrendIcon
          className={cn(
            'h-4 w-4',
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-muted-foreground mt-2 flex items-baseline justify-between text-xs">
          <div
            className={cn(
              'flex items-center gap-1',
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            )}
          >
            <TrendIcon className="h-3 w-3" />
            <span>
              {isPositive ? '+' : ''}
              {changePrefix}
              {change}
              {changeSuffix}
            </span>
          </div>
          <span>Target: {target}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MiniPerformanceMetrics({
  data = placeholderData,
}: MiniPerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((stat) => (
        <PerformanceStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export function MiniPerformanceMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-20" />
            <div className="flex items-baseline justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
