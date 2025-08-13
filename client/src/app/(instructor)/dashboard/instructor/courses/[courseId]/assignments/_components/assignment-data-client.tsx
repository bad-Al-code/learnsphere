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
import { getCourseAssignments, getCourseResources } from '../../actions';
import { AssignmentsList } from './assignment-list';
import { ResourcesManager } from './resource-manager';

export default function AssignmentsDataComponent({
  courseId,
  moduleOptions = [],
}: {
  courseId: string;
  moduleOptions: { label: string; value: string }[];
}) {
  const searchParams = useSearchParams();
  const [assignmentsData, setAssignmentsData] = useState({
    results: [],
    pagination: { currentPage: 1, totalPages: 0, totalResults: 0 },
  });
  const [resourcesData, setResourcesData] = useState({
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

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 6;

    const options = {
      courseId,
      q: searchParams.get('q') || undefined,
      status,
      moduleId: searchParams.get('moduleId') || undefined,
      page,
      limit,
    };

    setLoading(true);

    Promise.all([
      getCourseAssignments(options),
      getCourseResources(courseId, Number(searchParams.get('page')) || 1, 6),
    ])
      .then(([assignments, resources]) => {
        setAssignmentsData(assignments);
        setResourcesData(resources);
      })
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
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage all assignments for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentsList
            initialAssignments={assignmentsData.results}
            courseId={courseId}
            moduleOptions={moduleOptions}
          />
        </CardContent>
        <PaginationControls
          totalPages={assignmentsData.pagination.totalPages}
        />{' '}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources & Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourcesManager
            initialResources={resourcesData.results}
            courseId={courseId}
          />
        </CardContent>

        <PaginationControls totalPages={resourcesData.pagination.totalPages} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>Activities here</CardContent>
      </Card>
    </div>
  );
}
