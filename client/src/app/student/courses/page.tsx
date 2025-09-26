import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CoursesTabs } from './_components/courses-tab';
import { EnrolledTabSkeleton } from './_components/enrolled-tab';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'Enrolled Courses';

  const titles: Record<string, string> = {
    enrolled: 'Enrolled Courses',
    completed: 'Completed Courses',
    recommended: 'Recommended Courses',
    modules: 'Course Modules',
    assignments: 'Assignments',
    comparison: 'Comparison',
    materials: 'Course Materials',
    'study-groups': 'Study Groups',
    'learning-path': 'Learning Paths',
  };

  return {
    title: titles[tab] ?? 'Enrolled Courses',
  };
}

export default function MyCoursesPage() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="My Courses"
        description="Manage your learning journey and track your progress"
      />

      <Suspense fallback={<MyCoursesPageSkeleton />}>
        <CoursesTabs />
      </Suspense>
    </div>
  );
}

function MyCoursesPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <EnrolledTabSkeleton />
    </div>
  );
}
