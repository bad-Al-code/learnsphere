import { Suspense } from 'react';
import { DashboardHeader } from '../../_components/dashboard-header';
import { StatCards, StatCardsSkeleton } from './_components/stat-card';

export default function MyCoursesPage() {
  return (
    <div className="">
      <DashboardHeader
        title="Course Management"
        description="Create, manage, and track your courses and content."
      />

      <div className="mt-6">
        <Suspense fallback={<StatCardsSkeleton />}>
          <StatCards />
        </Suspense>
      </div>
    </div>
  );
}
