import { Skeleton } from '@/components/ui/skeleton';
import { studentAiToolsTabs } from '@/config/nav-items';
import { AiToolsTabs } from '@/features/ai-tools/_components/ai-tools-tabs';
import { AiTutorTabSkeleton } from '@/features/ai-tools/_components/ai-tutor-tab';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';

export const dynamic = 'force-dynamic';

export function AiToolsSkeleton() {
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

interface Props {
  searchParams: { tab?: string; courseId?: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const tab = searchParams.tab || 'AI Tutor';

  const titles: Record<string, string> = {
    'ai-tutor': 'AI Tutor',
    'smart-notes': 'Smart Notes',
    'writing-assistant': 'Writing Assistant',
    flashcards: 'Flashcards',
    'voice-tutor': 'Voice Tutor',
    research: 'Research',
    quiz: 'Quiz',
  };

  return { title: titles[tab] ?? 'AI Tutor' };
}

export default function AiTools({ searchParams }: Props) {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="AI Learning Assistant"
        titleClassName=" font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-secondary to-muted/50 bg-clip-text text-transparent"
        description="Your intelligent study companion powered by advanced AI. Get personalized help, practice problems, and study recommendations."
      />

      <Suspense fallback={<AiToolsSkeleton />}>
        <AiToolsTabs courseId={searchParams.courseId} />
      </Suspense>
    </div>
  );
}
