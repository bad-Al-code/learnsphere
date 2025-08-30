import { Skeleton } from '@/components/ui/skeleton';
import { studentAiToolsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { AiToolsTabs } from './_components/ai-tools-tabs';

function AiToolsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentAiToolsTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border">
          <p className="text-muted-foreground">Loading AI Tutor...</p>
        </div>
      </div>
    </div>
  );
}

export default function AiToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Learning Assistant"
        description="Your intelligent study companion powered by advanced AI. Get personalized help, practice problems, and study recommendations."
      />

      <Suspense fallback={<AiToolsPageSkeleton />}>
        <AiToolsTabs />
      </Suspense>
    </div>
  );
}
