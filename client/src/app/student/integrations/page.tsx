import { Skeleton } from '@/components/ui/skeleton';
import { studentIntegrationsTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { IntegrationsTabs } from './_components/integrations-tabs';
import { PageHeader, PageHeaderSkeleton } from './_components/page-header';
import { AllTabSkeleton } from './skeletons/all-tab-skeleton';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'All Integrations';

  const titles: Record<string, string> = {
    all: 'All Integrations',
    connected: 'Connected Integrations',
    available: 'Available Integrations',
  };

  return {
    title: titles[tab] ?? 'All Integrations',
  };
}

export default function IntegrationsPage() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="Integrations"
        description="Connect your favorite apps and services to enhance your learning workflow."
      />

      <Suspense fallback={<IntegrationsPageSkeleton />}>
        <IntegrationsTabs />
      </Suspense>
    </div>
  );
}

function IntegrationsPageSkeleton() {
  return (
    <div className="space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentIntegrationsTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <AllTabSkeleton />
      </div>
    </div>
  );
}
