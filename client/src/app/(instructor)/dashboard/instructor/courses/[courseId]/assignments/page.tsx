import { getCourseDetails } from '@/app/courses/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AssignmentsList } from './_components/assignment-list';

export default function CourseAssignmentsPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<AssignmentsSkeleton />}>
      <AssignmentsDataComponent courseId={params.courseId} />
    </Suspense>
  );
}

async function AssignmentsDataComponent({ courseId }: { courseId: string }) {
  const course = await getCourseDetails(courseId);
  if (!course) {
    notFound();
  }

  const allAssignments = course.modules.flatMap(
    (module: any) => module.assignments || []
  );
  const moduleOptions = course.modules.map((module: any) => ({
    label: module.title,
    value: module.id,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage all assignments for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentsList
            initialAssignments={allAssignments}
            courseId={course.id}
            moduleOptions={moduleOptions}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage downloadable resources here.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage quizzes and discussions here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AssignmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  );
}
