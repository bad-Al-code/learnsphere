import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CoursesTabs } from './_components/courses-tab';
import { EnrolledTabSkeleton } from './_components/enrolled-tab';

export default function MyCoursesPage() {
  return (
    <div className="space-y-2">
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
    <div className="space-y-2">
      <PageHeaderSkeleton />
      <EnrolledTabSkeleton />
    </div>
  );
}
