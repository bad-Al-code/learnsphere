import { Suspense } from 'react';
import { SummaryTabSkeleton } from './_components/student-summary-tab';
import { StudentDashboardTabs } from './_components/students-dashboard-tabs';

export default function StudentDashboardPage() {
  return (
    <div className="mb-4 space-y-4">
      <Suspense fallback={<SummaryTabSkeleton />}>
        <StudentDashboardTabs />
      </Suspense>
    </div>
  );
}
