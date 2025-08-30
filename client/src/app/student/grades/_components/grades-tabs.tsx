'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentGradesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const skeletonMap: Record<string, React.ReactNode> = {
  grades: <p>Loading Grades...</p>,
  progress: <p>Loading Progress...</p>,
  comparison: <p>Loading Comparison...</p>,
  'study-habits': <p>Loading Study Habits...</p>,
  'ai-insights': <p>Loading AI Insights...</p>,
  reports: <p>Loading Reports...</p>,
  goals: <p>Loading Goals...</p>,
};

const contentMap: Record<string, React.ReactNode> = {
  grades: <p>Grades</p>,
  progress: <p>Progress</p>,
  comparison: <p>Comparison</p>,
  'study-habits': <p>Study Habits</p>,
  'ai-insights': <p>AI Insights</p>,
  reports: <p>Reports</p>,
  goals: <p>Goals</p>,
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
      <div className="mt-6 flex h-48 items-center justify-center rounded-lg border">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl} className="text-2xl font-bold">
            {activeContent}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
