'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentGradesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AiInsightsTab, AiInsightsTabSkeleton } from './ai-insights-tab';
import { ComparisonTab, ComparisonTabSkeleton } from './comparison-tab';
import { GoalsTab, GoalsTabSkeleton } from './goals-tab';
import { GradesTab, GradesTabSkeleton } from './grade-tab';
import { ProgressTab, ProgressTabSkeleton } from './progress-tab';
import { ReportsTab, ReportsTabSkeleton } from './reports-tab';
import { StudyHabitsTab, StudyHabitsTabSkeleton } from './student-habit-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  grades: <GradesTabSkeleton />,
  progress: <ProgressTabSkeleton />,
  comparison: <ComparisonTabSkeleton />,
  'study-habits': <StudyHabitsTabSkeleton />,
  'ai-insights': <AiInsightsTabSkeleton />,
  reports: <ReportsTabSkeleton />,
  goals: <GoalsTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  grades: <GradesTab />,
  progress: <ProgressTab />,
  comparison: <ComparisonTab />,
  'study-habits': <StudyHabitsTab />,
  'ai-insights': <AiInsightsTab />,
  reports: <ReportsTab />,
  goals: <GoalsTab />,
};

export function GradesTabs() {
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
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading Grades...</p>;
  const activeContent = contentMap[currentTabFromUrl] || <p>Grades</p>;

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
