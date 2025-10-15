'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentGradesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { GoalsTab, GoalsTabSkeleton } from './goals-tab';
import { GradesTab, GradesTabSkeleton } from './grade-tab';
import { ProgressTab, ProgressTabSkeleton } from './progress-tab';
import { StudyHabitsTab, StudyHabitsTabSkeleton } from './student-habit-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  grades: <GradesTabSkeleton />,
  progress: <ProgressTabSkeleton />,
  // comparison: <ComparisonTabSkeleton />,
  'study-habits': <StudyHabitsTabSkeleton />,
  // 'ai-insights': <AiInsightsTabSkeleton />,
  // reports: <ReportsTabSkeleton />,
  goals: <GoalsTabSkeleton />,
};

const contentMap: Record<
  string,
  (props?: { courseId?: string }) => React.ReactNode
> = {
  grades: (props) => <GradesTab {...props} />,
  progress: (props) => <ProgressTab />,
  // comparison: <ComparisonTab />,
  'study-habits': (props) => <StudyHabitsTab />,
  // 'ai-insights': (props) => <AiInsightsTab />,
  // reports: (props) => <ReportsTab />,
  goals: (props) => <GoalsTab />,
};

export function GradesTabs({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'grades';
  const [activeTab, setActiveTab] = useState(currentTabFromUrl);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    if (courseId) {
      params.set('courseId', courseId);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading Grades...</p>;
  const activeContent = contentMap[activeTab]?.({ courseId }) || (
    <Skeleton className="h-48 w-full" />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentGradesTabs}
        basePath="/student/grades"
        activeTab="tab"
      />
      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>{activeContent}</TabsContent>
        )}
      </div>
    </Tabs>
  );
}
