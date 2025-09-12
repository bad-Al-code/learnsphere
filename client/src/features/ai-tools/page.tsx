import { Skeleton } from '@/components/ui/skeleton';
import { studentAiToolsTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import { AiToolsTabs } from './_components/ai-tools-tabs';
import { AiTutorTabSkeleton } from './_components/ai-tutor-tab';
import { PageHeader, PageHeaderSkeleton } from './_components/page-header';

function AiToolsPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: studentAiToolsTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <AiTutorTabSkeleton />
      </div>
    </div>
  );
}

export default function AiToolsPage() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="AI Learning Assistant"
        titleClassName=" font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-secondary to-muted/50 bg-clip-text text-transparent"
        description="Your intelligent study companion powered by advanced AI. Get personalized help, practice problems, and study recommendations."
      />

      <Suspense fallback={<AiToolsPageSkeleton />}>
        <AiToolsTabs />
      </Suspense>
    </div>
  );
}
