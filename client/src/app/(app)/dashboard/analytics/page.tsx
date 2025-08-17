import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { instructorAnalyticsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { DashboardHeader } from '../../_components/dashboard-header';
import { OverviewTab, OverviewTabSkeleton } from './_components/overview-tab';

interface AnalyticsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function StudentsPage({ searchParams }: AnalyticsPageProps) {
  return (
    <div>
      <Suspense fallback={<StudentsPageSkeleton />}>
        <AnalyticsStats searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

interface AnalyticsStatsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function AnalyticsStats({ searchParams }: AnalyticsStatsProps) {
  const tab =
    typeof searchParams.tab === 'string' ? searchParams.tab : 'overview';

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Student Management"
        description="Monitor student progress, engagement, and performance across all courses."
      />

      <Tabs value={tab}>
        <AppTabs
          tabs={instructorAnalyticsTabs}
          basePath="/dashboard/analytics"
          activeTab="tab"
        />

        <TabsContent value="overview" className="mt-5">
          <Suspense fallback={<OverviewTab />}>
            <OverviewTabSkeleton />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        {/* <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" /> */}
      </div>

      <div className="flex border-b">
        {/* {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24" />
        ))} */}
      </div>

      <div className="mt-6">{/* <OverviewTabSkeleton /> */}</div>
    </div>
  );
}
