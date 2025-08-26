import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
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
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <DashboardHeader
          title="Course Management"
          description="Create, manage, and track your courses and content."
        />

        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/courses/create">
            <PlusCircle className="h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      <div className="">
        <Suspense fallback={<StatCardsSkeleton />}>
          <StatCards />
        </Suspense>
      </div>

      <div className="space-y-2">
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
