import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getEngagementData } from '../actions';
import {
  DashboardTabLayout,
  DashboardTabLayoutSkeleton,
} from './dashboard-tab-layout';
import {
  EngagementPatternsChart,
  EngagementPatternsChartSkeleton,
} from './engagement-patterns-chart';
import {
  LearningRadarChart,
  LearningRadarChartSkeleton,
} from './learning-radar-chart';
import {
  ModuleProgressChart,
  ModuleProgressChartSkeleton,
} from './module-progression-chart';
import {
  TopStudentsTable,
  TopStudentsTableSkeleton,
} from './top-students-table';

export async function EngagementTab() {
  const { weeklyEngagement, learningAnalytics, moduleProgress, topStudents } =
    await getEngagementData();

  const mainContent = (
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

      <Card>
        <CardHeader>
          <CardTitle>Module Progress Distribution</CardTitle>
          <CardDescription>
            Student progress across course modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {moduleProgress.length > 0 ? (
            <ModuleProgressChart data={moduleProgress} />
          ) : (
            <ModuleProgressChartSkeleton />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Students</CardTitle>
          <CardDescription>
            Students with the highest engagement and performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topStudents.length > 0 ? (
            <TopStudentsTable data={topStudents} />
          ) : (
            <TopStudentsTableSkeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function EngagementTabSkeleton() {
  const mainContent = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <EngagementPatternsChartSkeleton />
      <LearningRadarChartSkeleton />
      <ModuleProgressChartSkeleton />
      <TopStudentsTableSkeleton />
    </div>
  );

  return <DashboardTabLayoutSkeleton mainContent={mainContent} />;
}
