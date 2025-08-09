import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import { searchAllCourses } from '../../actions';
import { CourseTable } from './_components/course-table';

interface ManageCoursesPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default function ManageCoursesPage({
  searchParams,
}: ManageCoursesPageProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Courses</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            Search, view, and manage all courses on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CourseTableSkeleton />}>
            <CoursesDataComponent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function CoursesDataComponent({ searchParams }: ManageCoursesPageProps) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const result = await searchAllCourses({ query, page: currentPage });

  return (
    <CourseTable
      courses={result.results}
      totalPages={result.pagination.totalPages}
    />
  );
}

function CourseTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-muted h-10 w-full max-w-sm animate-pulse rounded-md"></div>
        <div className="bg-muted h-10 w-20 animate-pulse rounded-md"></div>
      </div>
      <div className="rounded-lg border">
        <div className="bg-muted h-12 w-full animate-pulse rounded-t-md"></div>
        <div className="space-y-2 p-4">
          <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
