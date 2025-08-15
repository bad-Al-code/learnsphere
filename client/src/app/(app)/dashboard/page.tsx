import { AppTabs } from '@/components/ui/app-tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { instructorDashboardTabs } from '@/config/nav-items';
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';
import { Suspense } from 'react';
import { DashboardHeader } from '../_components/dashboard-header';

import {
  AnalyticsTab,
  AnalyticsTabSkeleton,
} from '../_components/analytics-tab';
import {
  ComparisonTab,
  ComparisonTabSkeleton,
} from '../_components/comparison-tab';
import {
  EngagementTab,
  EngagementTabSkeleton,
} from '../_components/engagement-tab';
import { EnrollmentChartSkeleton } from '../_components/enrollment-chart';
import { OverviewTab, OverviewTabSkeleton } from '../_components/overview-tab';
import {
  PerformanceTab,
  PerformanceTabSkeleton,
} from '../_components/performance-tab';
import { StatCard } from '../_components/stat-card';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <div>
      <Suspense fallback={<StatsGridSkeleton />}>
        <DashboardStats searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

interface DashboardStatsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function DashboardStats({ searchParams }: DashboardStatsProps) {
  const tab =
    typeof searchParams.tab === 'string' ? searchParams.tab : 'overview';

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Welcome back, Badal"
        description="Here's what's happening with your courses today."
      />

      <Tabs value={tab}>
        <AppTabs
          tabs={instructorDashboardTabs}
          basePath="/dashboard"
          activeTab="tab"
        />

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

        <TabsContent value="performance" className="mt-5">
          <Suspense fallback={<PerformanceTabSkeleton />}>
            <PerformanceTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="comparison" className="mt-5">
          <Suspense fallback={<ComparisonTabSkeleton />}>
            <ComparisonTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-5">
          <Suspense fallback={<AnalyticsTabSkeleton />}>
            <AnalyticsTab />
          </Suspense>
        </TabsContent>
        <TabsContent value="insights" className="mt-5">
          <p>Insights content coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="" icon={Users} isLoading />
        <StatCard title="" icon={IndianRupee} isLoading />
        <StatCard title="" icon={BookOpen} isLoading />
        <StatCard title="" icon={Star} isLoading />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollment Trend</CardTitle>
          <CardDescription>
            Monthly student enrollments over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentChartSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
