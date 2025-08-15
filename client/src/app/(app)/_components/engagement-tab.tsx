import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getEngagementData } from '../actions';
import {
  EngagementPatternsChart,
  EngagementPatternsChartSkeleton,
} from './engagement-patterns-chart';

export async function EngagementTab() {
  const { weeklyEngagement } = await getEngagementData();

  return (
    <div className="mt-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement Patterns</CardTitle>
          <CardDescription>
            Daily activity patterns and engagement metrics for the last 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyEngagement.length > 0 ? (
            <EngagementPatternsChart data={weeklyEngagement} />
          ) : (
            <EngagementPatternsChartSkeleton />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Module Progress Distribution</CardTitle>
          <CardDescription>
            Student progress across course modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground">(Chart coming soon...)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EngagementTabSkeleton() {
  return (
    <div className="mt-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
