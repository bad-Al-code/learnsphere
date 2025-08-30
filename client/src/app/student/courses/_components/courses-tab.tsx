'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCoursesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const skeletonMap: Record<string, React.ReactNode> = {
  enrolled: <p>Loading Enrolled </p>,
  completed: <p>Loading Completed </p>,
  recommended: <p>Loading recommended </p>,
  modules: <p>Modules Content...</p>,
  assignments: <p>Assignments Content...</p>,
  analytics: <p>Analytics Content...</p>,
  comparison: <p>Comparison Content...</p>,
  materials: <p>Materials Content...</p>,
  'study-groups': <p>Study Groups Content...</p>,
  'learning-path': <p>Learning Path Content...</p>,
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
        basePath="/student/my-courses"
        activeTab="tab"
      />
      <div className="mt-6">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'enrolled' && <p>Enrolled</p>}
            {currentTabFromUrl === 'completed' && <p>Courses</p>}
            {currentTabFromUrl === 'recommended' && <p>Recommended</p>}
            {currentTabFromUrl === 'modules' && <p>Modules Content...</p>}
            {currentTabFromUrl === 'assignments' && (
              <p>Assignments Content...</p>
            )}
            {currentTabFromUrl === 'analytics' && <p>Analytics Content...</p>}
            {currentTabFromUrl === 'comparison' && <p>Comparison Content...</p>}
            {currentTabFromUrl === 'materials' && <p>Materials Content...</p>}
            {currentTabFromUrl === 'study-groups' && (
              <p>Study Groups Content...</p>
            )}
            {currentTabFromUrl === 'learning-path' && (
              <p>Learning Path Content...</p>
            )}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
