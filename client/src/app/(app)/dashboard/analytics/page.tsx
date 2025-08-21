import { TabsContent } from '@/components/ui/tabs';
import { Suspense } from 'react';

import { DashboardHeader as AnalyticsHeader } from '../../_components/dashboard-header';
import { AnalyticsTabs } from './_components/analytics-tab';
import {
  CourseAnalysisTab,
  CourseAnalysisTabSkeleton,
} from './_components/course-analysis-tab';
import { OverviewTab, OverviewTabSkeleton } from './_components/overview-tab';
import { ReportsTab, ReportsTabSkeleton } from './_components/reports-tab';
import {
  StudentPerformanceTab,
  StudentPerformanceTabSkeleton,
} from './_components/student-performance-tab';
import { EngagementTab, EngagementTabSkeleton } from './engagement-tab';

export default function AnalyticsPage() {
  return (
    <div className="space-y-2">
      <AnalyticsHeader
        title="Analytics"
        description="Analyze trends and gain insights into your courses and student performance."
      />

      <AnalyticsTabs>
        <TabsContent value="overview">
          <Suspense fallback={<OverviewTabSkeleton />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="course-analysis">
          <Suspense fallback={<CourseAnalysisTabSkeleton />}>
            <CourseAnalysisTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="student-performance">
          <Suspense fallback={<StudentPerformanceTabSkeleton />}>
            <StudentPerformanceTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports">
          <Suspense fallback={<ReportsTabSkeleton />}>
            <ReportsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="engagement">
          <Suspense fallback={<EngagementTabSkeleton />}>
            <EngagementTab />
          </Suspense>
        </TabsContent>
      </AnalyticsTabs>
    </div>
  );
}
