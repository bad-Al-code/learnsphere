import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { instructorStudentsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { DashboardHeader } from '../../_components/dashboard-header';
import {
  ActivityLogTab,
  ActivityLogTabSkeleton,
} from './_components/activity-tab';
import {
  AllStudentsTab,
  AllStudentsTabSkeleton,
} from './_components/all-students-tab';
import {
  AnalyticsTab,
  AnalyticsTabSkeleton,
} from './_components/analytics-tab';
import { OverviewTab, OverviewTabSkeleton } from './_components/overview-tab';
import { StudentProfileCardSkeleton } from './_components/student-profile-card';
import { StudentProfilesTab } from './_components/students-profile';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function StudentsPage({ searchParams }: DashboardPageProps) {
  return (
    <div>
      <Suspense fallback={<StudentsPageSkeleton />}>
        <StudentPageStats searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

interface StudentsStatsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function StudentPageStats({ searchParams }: StudentsStatsProps) {
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
          tabs={instructorStudentsTabs}
          basePath="/dashboard/students"
          activeTab="tab"
        />

        <TabsContent value="overview" className="mt-5">
          <Suspense fallback={<OverviewTabSkeleton />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="all-students" className="mt-5">
          <Suspense fallback={<AllStudentsTabSkeleton />}>
            <AllStudentsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="student-profiles" className="mt-5">
          <Suspense fallback={<StudentProfileCardSkeleton />}>
            <StudentProfilesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-5">
          <Suspense fallback={<AnalyticsTabSkeleton />}>
            <AnalyticsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <Suspense fallback={<ActivityLogTabSkeleton />}>
            <ActivityLogTab />
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
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="flex border-b">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24" />
        ))}
      </div>

      <div className="mt-6">
        <OverviewTabSkeleton />
      </div>
    </div>
  );
}
