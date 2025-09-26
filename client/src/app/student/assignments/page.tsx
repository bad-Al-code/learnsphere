import { Skeleton } from '@/components/ui/skeleton';
import { studentAssignmentsTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { AssignmentsTabs } from './_components/assignments-tabs';
import { UpcomingTabSkeleton } from './_components/upcoming-tab';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'upcoming';

  const titles: Record<string, string> = {
    upcoming: 'Upcoming Assignments',
    submitted: 'Submitted Assignments',
    drafts: 'Draft Assignments',
    'peer-review': 'Peer Review',
    templates: 'Templates',
    collaborative: 'Collaborative Work',
    portfolio: 'Portfolio',
    analytics: 'Analytics',
  };

  return {
    title: titles[tab] ?? 'Assignments',
  };
}

export default function AssignmentsPage({
  searchParams,
}: {
  searchParams: { tab?: string; courseId?: string };
}) {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="Assignments"
        description="Manage your assignments and track submission status"
      />

      <Suspense fallback={<AssignmentsPageSkeleton />}>
        <AssignmentsTabs courseId={searchParams.courseId} />
      </Suspense>
    </div>
  );
}

function AssignmentsPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentAssignmentsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <UpcomingTabSkeleton />
      </div>
    </div>
  );
}
