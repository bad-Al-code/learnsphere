import { PaginationControls } from '@/components/shared/pagination-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { getMyCourses } from '../actions';
import { InstructorCourseCard } from './instructor-course-card';

interface MyCoursesGridProps {
  query?: string;
  status?: string;
  page?: number;
}

export async function MyCoursesGrid({
  query,
  status,
  page,
}: MyCoursesGridProps) {
  const { results, pagination } = await getMyCourses({ query, status, page });

  if (results.length === 0) {
    return (
      <div className="text-muted-foreground mt-8 text-center">
        No courses found matching your criteria.
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((course) => (
          <InstructorCourseCard key={course.id} course={course} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationControls totalPages={pagination.totalPages} />
      </div>
    </>
  );
}

export function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      ))}
    </div>
  );
}
