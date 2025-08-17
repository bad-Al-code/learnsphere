'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

interface SubscriptionData {
  tier: string;
  revenue: number;
  students: number;
  progressValue: number;
}

interface SubscriptionAnalysisProps {
  data?: SubscriptionData[];
}

const placeholderData: SubscriptionData[] = [
  { tier: 'Premium', revenue: 45000, students: 750, progressValue: 75 },
  { tier: 'Basic', revenue: 15000, students: 500, progressValue: 25 },
];

export function SubscriptionAnalysis({
  data = placeholderData,
}: SubscriptionAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Analysis</CardTitle>
        <CardDescription>Revenue by subscription type</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {data.map((sub) => (
            <div key={sub.tier} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <p className="font-medium">{sub.tier}</p>
                <p className="text-xl font-bold">{formatPrice(sub.revenue)}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Progress value={sub.progressValue} className="h-2 flex-1" />
                <div className="text-muted-foreground text-sm whitespace-nowrap">
                  {sub.students.toLocaleString()} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscriptionAnalysisSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-52" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
