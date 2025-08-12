'use client';

import { PaginationControls } from '@/app/courses/_components/pagination-controls';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCourseAssignments } from '../../actions';
import { AssignmentsList } from './assignment-list';

export default function AssignmentsDataComponent({
  courseId,
  moduleOptions = [],
}: {
  courseId: string;
  moduleOptions: { label: string; value: string }[];
}) {
  const searchParams = useSearchParams();
  const [data, setData] = useState({
    results: [],
    pagination: { currentPage: 1, totalPages: 0, totalResults: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const status: 'draft' | 'published' | undefined =
      statusParam === 'draft' || statusParam === 'published'
        ? statusParam
        : undefined;

    const options = {
      courseId,
      q: searchParams.get('q') || undefined,
      status,
      moduleId: searchParams.get('moduleId') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 5,
    };

    console.log('Options sent to getCourseAssignments:', options);

    setLoading(true);
    getCourseAssignments(options)
      .then(setData)
      .finally(() => setLoading(false));
  }, [courseId, searchParams]);

  if (loading) {
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
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>
              Manage all assignments for this course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssignmentsList
              initialAssignments={data.results}
              courseId={courseId}
              moduleOptions={moduleOptions}
            />
          </CardContent>
        </Card>
        <PaginationControls totalPages={data.pagination.totalPages} />
      </div>

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
