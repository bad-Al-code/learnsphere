import { Skeleton } from '@/components/ui/skeleton';
import { studentAnalyticsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { AnalyticsTabs } from './_components/analytics-tabs';

function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentAnalyticsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading Performance...</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Analytics"
        description="Track your performance and engagement metrics"
      />

      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsTabs />
      </Suspense>
    </div>
  );
}
