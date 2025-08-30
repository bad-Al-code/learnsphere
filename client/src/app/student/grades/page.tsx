import { Skeleton } from '@/components/ui/skeleton';
import { studentGradesTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { GradesTabSkeleton } from './_components/grade-tab';
import { GradesTabs } from './_components/grades-tabs';

function GradesPageSkeleton() {
  return (
    <div className="space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-2">
        <div className="flex border-b">
          {Array.from({ length: studentGradesTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <GradesTabSkeleton />
      </div>
    </div>
  );
}

export default function GradesPage() {
  return (
    <div className="space-y-2">
      <PageHeader
        title="Grades & Progress"
        description="Advanced insights into your learning journey and performance"
      />

      <Suspense fallback={<GradesPageSkeleton />}>
        <GradesTabs />
      </Suspense>
    </div>
  );
}
