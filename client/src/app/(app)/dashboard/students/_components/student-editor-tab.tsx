'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { instructorStudentsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { ActivityLogTab, ActivityLogTabSkeleton } from './activity-tab';
import { AllStudentsTab, AllStudentsTabSkeleton } from './all-students-tab';
import { AnalyticsTab, AnalyticsTabSkeleton } from './analytics-tab';
import { OverviewTab, OverviewTabSkeleton } from './overview-tab';
import {
  StudentProfilesTab,
  StudentProfilesTabSkeleton,
} from './students-profile';

const skeletonMap: Record<string, React.ReactNode> = {
  overview: <OverviewTabSkeleton />,
  'all-students': <AllStudentsTabSkeleton />,
  'student-profiles': <StudentProfilesTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
  activity: <ActivityLogTabSkeleton />,
};

export function StudentTabs() {
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
        tabs={instructorStudentsTabs}
        basePath="/dashboard/students"
        activeTab="tab"
      />

      <div className="mt-0">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'overview' && <OverviewTab />}
            {currentTabFromUrl === 'all-students' && <AllStudentsTab />}
            {currentTabFromUrl === 'student-profiles' && <StudentProfilesTab />}
            {currentTabFromUrl === 'analytics' && <AnalyticsTab />}
            {currentTabFromUrl === 'activity' && <ActivityLogTab />}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
