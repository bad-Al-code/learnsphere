import { Suspense } from 'react';
import { DashboardHeader } from '../../_components/dashboard-header';
import { CourseFilters } from './_components/course-filters';
import {
  CoursesGridSkeleton,
  MyCoursesGrid,
} from './_components/my-courses-grid';
import { StatCards, StatCardsSkeleton } from './_components/stat-card';

export default function MyCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query =
    typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const status =
    typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Course Management"
        description="Create, manage, and track your courses and content."
      />

      <div className="">
        <Suspense fallback={<StatCardsSkeleton />}>
          <StatCards />
        </Suspense>
      </div>

      <div className="space-y-6">
        <CourseFilters />
        <Suspense
          key={query! + page + status}
          fallback={<CoursesGridSkeleton />}
        >
          <MyCoursesGrid query={query} status={status} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
