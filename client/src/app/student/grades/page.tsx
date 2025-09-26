import { Skeleton } from '@/components/ui/skeleton';
import { studentGradesTabs } from '@/config/nav-items';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader, PageHeaderSkeleton } from '../_components/page-header';
import { GradesTabSkeleton } from './_components/grade-tab';
import { GradesTabs } from './_components/grades-tabs';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tab?: string };
}): Promise<Metadata> {
  const tab = searchParams.tab || 'Grades';

  const titles: Record<string, string> = {
    grades: 'Grades',
    progress: 'Progress',
    comparison: 'Comparison',
    'study-habits': 'Study Habits',
    'ai-insights': 'AI Insights',
    reports: 'Reports',
    goals: 'Goals',
  };

  return {
    title: titles[tab] ?? 'Grades',
  };
}

export default function GradesPage() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeader
        title="Grades & Progress"
        description="Advanced insights into your learning journey and performance"
      />

      <Suspense fallback={<GradesPageSkeleton />}>
        <GradesTabs />
      </Suspense>
    </div>
  );
}

function GradesPageSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <PageHeaderSkeleton />
      <div className="space-y-2">
        <div className="flex border-b">
          {Array.from({ length: studentGradesTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <GradesTabSkeleton />
      </div>
    </div>
  );
}
