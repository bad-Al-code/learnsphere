import { Skeleton } from '@/components/ui/skeleton';
import { studentAnalyticsTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { AnalyticsTabs } from './_components/analytics-tabs';
import { PerformanceTabSkeleton } from './_components/performance-tab';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'Performance';

  const titles: Record<string, string> = {
    performance: 'Performance',
    engagement: 'Engagement',
    'ai-insights': 'AI Insights',
  };

  return {
    title: titles[tab] || 'Performance',
  };
}

export default function AnalyticsPage() {
  return (
    <div className="mb-4 space-y-2">
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

function AnalyticsPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-2">
        <div className="flex border-b">
          {Array.from({ length: studentAnalyticsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
      </div>
      <PerformanceTabSkeleton />
    </div>
  );
}
