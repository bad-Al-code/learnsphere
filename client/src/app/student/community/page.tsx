import { Skeleton } from '@/components/ui/skeleton';
import { studentCommunityTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { ChatTabSkeleton } from './_components/chat-tab';
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
        <ChatTabSkeleton />
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
