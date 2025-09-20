import { Skeleton } from '@/components/ui/skeleton';
import { studentPersonalizationTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PersonalizationTabs } from './_components/customize-tabs';
import { ThemesTabSkeleton } from './_components/themes-tab';
import {
  PageHeader,
  PageHeaderSkeleton,
} from '../dashboard/_components/page-header';

function PersonalizationPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentPersonalizationTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <ThemesTabSkeleton />
      </div>
    </div>
  );
}

export default function PersonalizationPage() {
  return (
    <div className="mb-4 space-y-2">
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
