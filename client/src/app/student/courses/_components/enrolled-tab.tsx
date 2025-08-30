'use client';

import { CourseFilters, CourseFiltersSkeleton } from './course-filters';
import { CourseList, CourseListSkeleton } from './courses-list';

export function EnrolledTab() {
  return (
    <div className="space-y-2">
      <CourseFilters />
      <CourseList />
    </div>
  );
}

export function EnrolledTabSkeleton() {
  return (
    <div className="space-y-2">
      <CourseFiltersSkeleton />
      <CourseListSkeleton />
    </div>
  );
}
