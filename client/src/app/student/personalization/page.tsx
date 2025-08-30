import { Skeleton } from '@/components/ui/skeleton';
import { studentPersonalizationTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { PersonalizationTabs } from './_components/customize-tabs';

function PersonalizationPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentPersonalizationTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading Themes...</p>
        </div>
      </div>
    </div>
  );
}

export default function PersonalizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalization"
        description="Customize your learning environment, themes, and preferences."
      />

      <Suspense fallback={<PersonalizationPageSkeleton />}>
        <PersonalizationTabs />
      </Suspense>
    </div>
  );
}
