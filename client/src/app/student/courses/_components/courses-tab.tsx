'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCoursesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AnalyticsTab, AnalyticsTabSkeleton } from './analytics-tab';
import { EnrolledTab, EnrolledTabSkeleton } from './enrolled-tab';
import { ModulesTab, ModulesTabSkeleton } from './modules-tab';
import { StudyGroupTab, StudyGroupTabSkeleton } from './study-groups-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  enrolled: <EnrolledTabSkeleton />,
  // completed: <CompletedTabSkeleton />,
  // recommended: <RecommendedTabSkeleton />,
  modules: <ModulesTabSkeleton />,
  // assignments: <AssignmentsTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
  // comparison: <ComparisonTabSkeleton />,
  // materials: <MaterialsTabSkeleton />,
  'study-groups': <StudyGroupTabSkeleton />,
  // 'learning-path': <LearningPathTabSkeleton />,
};

export function CoursesTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'enrolled';
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

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading Enrolled</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentCoursesTabs}
        basePath="/student/courses"
        activeTab="tab"
      />
      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'enrolled' && <EnrolledTab />}
            {/* {currentTabFromUrl === 'completed' && <CompletedTab />} */}
            {/* {currentTabFromUrl === 'recommended' && <RecommendedTab />} */}
            {currentTabFromUrl === 'modules' && <ModulesTab />}
            {/* {currentTabFromUrl === 'assignments' && <AssignmentsTab />} */}
            {currentTabFromUrl === 'analytics' && <AnalyticsTab />}
            {/* {currentTabFromUrl === 'comparison' && <ComparisonTab />} */}
            {/* {currentTabFromUrl === 'materials' && <MaterialsTab />} */}
            {currentTabFromUrl === 'study-groups' && <StudyGroupTab />}
            {/* {currentTabFromUrl === 'learning-path' && <LearningPathTab />} */}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
