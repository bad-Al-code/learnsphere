import { Skeleton } from '@/components/ui/skeleton';
import { studentCoursesTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CoursesTabs } from './_components/courses-tab';

function MyCoursesPageSkeleton() {
  return (
    <div className="space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-2">
        <div className="flex border-b">
          {Array.from({ length: studentCoursesTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>

        <p>Loading </p>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <div className="space-y-2">
      <PageHeader
        title="My Courses"
        description="Manage your enrolled courses, track progress, and find new learning opportunities."
      />

      <Suspense fallback={<MyCoursesPageSkeleton />}>
        <CoursesTabs />
      </Suspense>
    </div>
  );
}
