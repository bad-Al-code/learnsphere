import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { courseEditorTabs } from '@/config/nav-items';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCourseDetails } from '../actions';
import {
  AnalyticsTab,
  AnalyticsTabSkeleton,
} from './_components/analytics-tab';
import {
  AssignmentsTab,
  AssignmentsTabSkeleton,
} from './_components/assignment-tab';
import { ContentTab, ContentTabSkeleton } from './_components/content-tab';
import { PageHeader, PageHeaderSkeleton } from './_components/course-header';
import OverviewTab, { OverviewTabSkeleton } from './_components/overview-tab';
import {
  ResourcesTab,
  ResourcesTabSkeleton,
} from './_components/resources-tab';
import { SettingsTab, SettingsTabSkeleton } from './_components/settings-tab';

interface CourseEditorPageProps {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function CourseEditorPageContent({
  params,
  searchParams,
}: CourseEditorPageProps) {
  const tab =
    typeof searchParams.tab === 'string' ? searchParams.tab : 'overview';

  const { courseId } = params;
  const course = await getCourseDetails(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="">
      <PageHeader title={course.title} description={course.description} />

      <Tabs value={tab} className="w-full">
        <AppTabs
          tabs={courseEditorTabs}
          basePath={`/dashboard/courses/${courseId}`}
          activeTab="tab"
        />

        <TabsContent value="overview" className="mt-2">
          <Suspense fallback={<OverviewTabSkeleton />}>
            <OverviewTab params={{ courseId }} />
          </Suspense>
        </TabsContent>

        <TabsContent value="content" className="mt-2">
          <Suspense fallback={<ContentTabSkeleton />}>
            <ContentTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="assignments" className="mt-2">
          <Suspense fallback={<AssignmentsTabSkeleton />}>
            <AssignmentsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="resources" className="mt-2">
          <Suspense fallback={<ResourcesTabSkeleton />}>
            <ResourcesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-2">
          <Suspense fallback={<AnalyticsTabSkeleton />}>
            <AnalyticsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="mt-2">
          <Suspense fallback={<SettingsTabSkeleton />}>
            <SettingsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CourseEditorPage({
  params,
  searchParams,
}: CourseEditorPageProps) {
  return (
    <Suspense
      fallback={<CourseEditorPageSkeleton searchParams={searchParams} />}
    >
      <CourseEditorPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

function CourseEditorPageSkeleton({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tab =
    typeof searchParams.tab === 'string' ? searchParams.tab : 'overview';

  const renderTabSkeleton = () => {
    switch (tab) {
      case 'content':
        return <ContentTabSkeleton />;
      case 'assignments':
        return <AssignmentsTabSkeleton />;
      case 'resources':
        return <ResourcesTabSkeleton />;
      case 'analytics':
        return <AnalyticsTabSkeleton />;
      case 'settings':
        return <SettingsTabSkeleton />;
      case 'overview':
      default:
        return <OverviewTabSkeleton />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: courseEditorTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>

        {renderTabSkeleton()}
      </div>
    </div>
  );
}
