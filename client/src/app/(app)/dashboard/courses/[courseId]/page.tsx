import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { courseEditorTabs } from '@/config/nav-items';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCourseDetails } from '../actions';
import { CourseHeader } from './_components/course-header';
import OverviewTab, { OverviewTabSkeleton } from './_components/overview-tab';

interface CourseEditorPageProps {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CourseEditorPage({
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
    <div className="space-y-2">
      <CourseHeader title={course.title} description={course.description} />

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
          <p>Content Tab Content Goes Here...</p>
        </TabsContent>

        <TabsContent value="assignments" className="mt-2">
          <p>Assignments Tab Content Goes Here...</p>
        </TabsContent>

        <TabsContent value="resources" className="mt-2">
          <p>Resources Tab Content Goes Here...</p>
        </TabsContent>

        <TabsContent value="analytics" className="mt-2">
          <p>Analytics Tab Content Goes Here...</p>
        </TabsContent>

        <TabsContent value="settings" className="mt-2">
          <p>Settings Tab Content Goes Here...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
