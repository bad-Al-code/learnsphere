import { Skeleton } from '@/components/ui/skeleton';
import { studentIntegrationsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { AllTabSkeleton } from './_components/all-tab';
import { IntegrationsTabs } from './_components/integrations-tabs';

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
