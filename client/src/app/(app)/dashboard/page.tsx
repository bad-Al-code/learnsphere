import { TabsContent } from '@/components/ui/tabs';
import { Suspense } from 'react';
import {
  AnalyticsTab,
  AnalyticsTabSkeleton,
} from '../_components/analytics-tab';
import {
  ComparisonTab,
  ComparisonTabSkeleton,
} from '../_components/comparison-tab';
import { DashboardHeader } from '../_components/dashboard-header';
import { DashboardTabs } from '../_components/dashboard-tabs';
import {
  EngagementTab,
  EngagementTabSkeleton,
} from '../_components/engagement-tab';
import { InsightsTab, InsightsTabSkeleton } from '../_components/insight-tab';
import { OverviewTab, OverviewTabSkeleton } from '../_components/overview-tab';
import {
  PerformanceTab,
  PerformanceTabSkeleton,
} from '../_components/performance-tab';

export default function DashboardPage() {
  const userName = 'Badal';

  return (
    <div className="space-y-2">
      <DashboardHeader
        title={`Welcome back, ${userName}`}
        description="Here's what's happening with your courses today."
      />

      <DashboardTabs>
        <TabsContent value="overview">
          <Suspense fallback={<OverviewTabSkeleton />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="engagement">
          <Suspense fallback={<EngagementTabSkeleton />}>
            <EngagementTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="performance">
          <Suspense fallback={<PerformanceTabSkeleton />}>
            <PerformanceTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="comparison">
          <Suspense fallback={<ComparisonTabSkeleton />}>
            <ComparisonTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <Suspense fallback={<AnalyticsTabSkeleton />}>
            <AnalyticsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="insights">
          <Suspense fallback={<InsightsTabSkeleton />}>
            <InsightsTab />
          </Suspense>
        </TabsContent>
      </DashboardTabs>
    </div>
  );
}
