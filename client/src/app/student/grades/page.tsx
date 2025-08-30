import { Skeleton } from '@/components/ui/skeleton';
import { studentGradesTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { GradesTabs } from './_components/grades-tabs';

function GradesPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentGradesTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading Grades...</p>
        </div>
      </div>
    </div>
  );
}

export default function GradesPage() {
  return (
    <div className="space-y-6">
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
