import { Metadata } from 'next';
import { Suspense } from 'react';
import { SummaryTabSkeleton } from './dashboard/_components/student-summary-tab';
import { StudentDashboardTabs } from './dashboard/_components/students-dashboard-tabs';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'Summary';

  const titles: Record<string, string> = {
    summary: 'Summary',
    leaderboard: 'Leaderboard',
    insights: 'AI Insights',
    notification: 'Notifications',
    activity: 'Activity',
  };

  return {
    title: titles[tab] ?? 'Summary',
  };
}

export default function StudentDashboardPage() {
  return (
    <div className="mb-4 space-y-4">
      <Suspense fallback={<SummaryTabSkeleton />}>
        <StudentDashboardTabs />
      </Suspense>
    </div>
  );
}
