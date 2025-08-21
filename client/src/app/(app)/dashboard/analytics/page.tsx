import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { instructorAnalyticsTabs } from '@/config/nav-items';
import { Suspense } from 'react';

import {
  DashboardHeader as AnalyticsHeader,
  DashboardHeaderSkeleton as AnalyticsHeaderSkeleton,
} from '../../_components/dashboard-header';
import { AnalyticsTabs } from './_components/analytics-tab';
import { OverviewTab, OverviewTabSkeleton } from './_components/overview-tab';

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-2">
      <AnalyticsHeaderSkeleton />

      <div className="space-y-2">
        <div className="flex border-b">
          {Array.from({ length: instructorAnalyticsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>

        <OverviewTabSkeleton />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-2">
      <AnalyticsHeader
        title="Analytics"
        description="Analyze trends and gain insights into your courses and student performance."
      />

      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsTabs>
          <TabsContent value="overview">
            <Suspense fallback={<OverviewTabSkeleton />}>
              <OverviewTab />
            </Suspense>
          </TabsContent>
        </AnalyticsTabs>
      </Suspense>
    </div>
  );
}
