import { getCurrentUser } from '@/app/(auth)/actions';
import { TabsContent } from '@/components/ui/tabs';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
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
import { ResourceTab } from './_components/resources-tab';
import { SettingsTab, SettingsTabSkeleton } from './_components/settings-tab';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'overview';

  return {
    title: `Course - ${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
  };
}

interface CourseEditorPageProps {
  params: { courseId: string };
  searchParams: { tab?: string };
}

export default async function CourseEditorPage({
  params,
  searchParams,
}: CourseEditorPageProps) {
  const [courseResult, user] = await Promise.all([
    getCourseForEditor(params.courseId),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect('/login');
  }

  if (!courseResult.success || !courseResult.data) {
    notFound();
  }
  const course = courseResult.data;

  if (user.role !== 'admin' && course.instructorId !== user.userId) {
    notFound();
  }

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
              <AssignmentsTab
                courseId={params.courseId}
                searchParams={searchParams}
              />
            </Suspense>
          )}
          {currentTab === 'resources' && (
            <ResourceTab
              courseId={params.courseId}
              searchParams={searchParams}
            />
          )}
          {currentTab === 'analytics' && (
            <Suspense fallback={<AnalyticsTabSkeleton />}>
              <AnalyticsTab />
            </Suspense>
          )}
          {currentTab === 'settings' && (
            <Suspense fallback={<SettingsTabSkeleton />}>
              <SettingsTab courseId={params.courseId} />
            </Suspense>
          )}
        </TabsContent>
      </CourseEditorTabs>
    </div>
  );
}
