import { Skeleton } from '@/components/ui/skeleton';
import { studentIntegrationsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { IntegrationsTabs } from './_components/integrations-tabs';

function IntegrationsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentIntegrationsTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading All Integrations...</p>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
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