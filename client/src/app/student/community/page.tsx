import { Skeleton } from '@/components/ui/skeleton';
import { studentCommunityTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { CommunityTabs } from './_components/community-tabs';

function CommunityPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentCommunityTabs.length }).map(
            (_, index) => (
              <Skeleton key={index} className="h-10 flex-1" />
            )
          )}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading Chat...</p>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Connect with classmates, instructors, and get AI assistance"
      />

      <Suspense fallback={<CommunityPageSkeleton />}>
        <CommunityTabs />
      </Suspense>
    </div>
  );
}
