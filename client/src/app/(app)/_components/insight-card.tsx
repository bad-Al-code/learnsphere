'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, LucideIcon, TrendingUp, Video } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  clock: Clock,
  video: Video,
  trendingUp: TrendingUp,
};

interface InsightCardProps {
  title: string;
  mainValue: string;
  description: string;
  recommendation: string;
  iconName: keyof typeof iconMap;
}

export function InsightCard({
  title,
  mainValue,
  description,
  recommendation,
  iconName,
}: InsightCardProps) {
  const Icon = iconMap[iconName];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{mainValue}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <Icon className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground">{recommendation}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-2/5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-7 w-1/3" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </CardContent>
    </Card>
  );
}
