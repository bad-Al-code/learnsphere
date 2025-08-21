'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs } from '@/components/ui/tabs';
import { instructorAnalyticsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { EngagementTabSkeleton } from '../engagement-tab';
import { CourseAnalysisTabSkeleton } from './course-analysis-tab';
import { OverviewTabSkeleton } from './overview-tab';
import { ReportsTabSkeleton } from './reports-tab';
import { StudentPerformanceTabSkeleton } from './student-performance-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  overview: <OverviewTabSkeleton />,
  'course-analysis': <CourseAnalysisTabSkeleton />,
  'student-performance': <StudentPerformanceTabSkeleton />,
  engagement: <EngagementTabSkeleton />,
  reports: <ReportsTabSkeleton />,
};

export function AnalyticsTabs({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'overview';

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

  const pendingSkeleton = skeletonMap[activeTab] || <OverviewTabSkeleton />;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={instructorAnalyticsTabs}
        basePath="/dashboard/analytics"
        activeTab="tab"
      />
      <div className="">{isPending ? pendingSkeleton : children}</div>
    </Tabs>
  );
}
