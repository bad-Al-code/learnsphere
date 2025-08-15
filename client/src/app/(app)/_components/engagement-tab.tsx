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
import {
  LearningRadarChart,
  LearningRadarChartSkeleton,
} from './learning-radar-chart';

export async function EngagementTab() {
  const { weeklyEngagement, learningAnalytics } = await getEngagementData();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <CardTitle>Learning Analytics Radar</CardTitle>
          <CardDescription>Current vs target learning metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {learningAnalytics.length > 0 ? (
            <LearningRadarChart data={learningAnalytics} />
          ) : (
            <LearningRadarChartSkeleton />
          )}
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
