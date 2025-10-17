'use client';

import { CourseFilters, CourseFiltersSkeleton } from './course-filters';
import { CourseList, CourseListSkeleton } from './courses-list';
import { RecommendedTab, RecommendedTabSkeleton } from './recommended-tab';

export function EnrolledTab() {
  return (
    <div className="space-y-2">
      <CourseFilters />
      <CourseList />
      <RecommendedTab />
    </div>
  );
}

export function EnrolledTabSkeleton() {
  return (
    <div className="space-y-2">
      <CourseFiltersSkeleton />
      <CourseListSkeleton />
      <RecommendedTabSkeleton />
    </div>
  );
}
