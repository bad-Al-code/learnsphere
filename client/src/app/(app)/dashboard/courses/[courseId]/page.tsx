import { TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCourseForEditor } from '../actions';
import {
  AnalyticsTab,
  AnalyticsTabSkeleton,
} from './_components/analytics-tab';
import {
  AssignmentsTab,
  AssignmentsTabSkeleton,
} from './_components/assignment-tab';
import { ContentTab, ContentTabSkeleton } from './_components/content-tab';
import { CourseEditorTabs } from './_components/course-editor-tab';
import { PageHeader, PageHeaderSkeleton } from './_components/course-header';
import { OverviewTab, OverviewTabSkeleton } from './_components/overview-tab';
import {
  ResourcesTab,
  ResourcesTabSkeleton,
} from './_components/resources-tab';
import { SettingsTab, SettingsTabSkeleton } from './_components/settings-tab';

interface CourseEditorPageProps {
  params: { courseId: string };
  searchParams: { tab?: string };
}

export default async function CourseEditorPage({
  params,
  searchParams,
}: CourseEditorPageProps) {
  const result = await getCourseForEditor(params.courseId);
  if (!result.success || !result.data) {
    notFound();
  }
  const course = result.data;
  const currentTab = searchParams.tab || 'overview';

  return (
    <div className="space-y-2">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <PageHeader title={course.title} description={course.description} />
      </Suspense>

      <CourseEditorTabs courseId={params.courseId}>
        <TabsContent value={currentTab}>
          {currentTab === 'overview' && (
            <Suspense fallback={<OverviewTabSkeleton />}>
              <OverviewTab courseId={params.courseId} />
            </Suspense>
          )}
          {currentTab === 'content' && (
            <Suspense fallback={<ContentTabSkeleton />}>
              <ContentTab courseId={params.courseId} />
            </Suspense>
          )}
          {currentTab === 'assignments' && (
            <Suspense fallback={<AssignmentsTabSkeleton />}>
              <AssignmentsTab />
            </Suspense>
          )}
          {currentTab === 'resources' && (
            <Suspense fallback={<ResourcesTabSkeleton />}>
              <ResourcesTab />
            </Suspense>
          )}
          {currentTab === 'analytics' && (
            <Suspense fallback={<AnalyticsTabSkeleton />}>
              <AnalyticsTab />
            </Suspense>
          )}
          {currentTab === 'settings' && (
            <Suspense fallback={<SettingsTabSkeleton />}>
              <SettingsTab />
            </Suspense>
          )}
        </TabsContent>
      </CourseEditorTabs>
    </div>
  );
}
