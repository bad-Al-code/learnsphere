import { Skeleton } from '@/components/ui/skeleton';
import { instructorStudentsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import {
  DashboardHeader as LessonHeader,
  DashboardHeaderSkeleton as LessonHeaderSkeleton,
} from '../../_components/dashboard-header';
import { OverviewTabSkeleton } from './_components/overview-tab';
import { StudentTabs } from './_components/student-editor-tab';

function StudentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <LessonHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: instructorStudentsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>

        <OverviewTabSkeleton />
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <LessonHeader
        title="Student Management"
        description="Monitor student progress, engagement, and performance across all courses."
      />

      <Suspense fallback={<StudentsPageSkeleton />}>
        <StudentTabs />
      </Suspense>
    </div>
  );
}
