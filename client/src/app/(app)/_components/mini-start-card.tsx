'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface MiniStatCardProps {
  title: string;
  value: string;
  change: number;
  target?: string;
}

export function MiniStatCard({
  title,
  value,
  change,
  target,
}: MiniStatCardProps) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={cn(
            'h-4 w-4',
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-muted-foreground flex items-baseline text-xs">
          <span
            className={cn(
              'mr-1 font-semibold',
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            )}
          >
            {isPositive ? '+' : ''}
            {change}%
          </span>
          {target && <span>Target: {target}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

// New Skeleton Component
export function MiniStatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-7 w-20" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}
