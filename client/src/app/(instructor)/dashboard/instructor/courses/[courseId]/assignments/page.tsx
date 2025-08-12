import { getCourseDetails } from '@/app/courses/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AssignmentsDataComponent from './_components/assignment-data-client';
import { AssignmentFilters } from './_components/assignment-filters';

interface CourseAssignmentsPageProps {
  params: { courseId: string };
  searchParams: {
    q?: string;
    status?: string;
    moduleId?: string;
    page?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function CourseAssignmentsPage({
  params,
}: CourseAssignmentsPageProps) {
  const course = await getCourseDetails(params.courseId);
  if (!course) notFound();

  const moduleOptions = course.modules.map((module: any) => ({
    label: module.title,
    value: module.id,
  }));

  return (
    <Suspense fallback={<AssignmentsSkeleton />}>
      <AssignmentFilters moduleOptions={moduleOptions} />
      <AssignmentsDataComponent
        courseId={params.courseId}
        moduleOptions={moduleOptions}
      />
    </Suspense>
  );
}

function AssignmentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-full sm:max-w-xs" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3 rounded-lg border p-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
