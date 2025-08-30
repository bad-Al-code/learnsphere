'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentDashboardTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { InsightsTabSkeleton, InsightTab } from './insight-tab';
import { ClassLeaderboard, ClassLeaderboardSkeleton } from './leaderboard-tab';
import { NotificationTab, NotificationTabSkeleton } from './notification-tab';
import { SummaryTab, SummaryTabSkeleton } from './student-summary-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  summary: <SummaryTabSkeleton />,
  leaderboard: <ClassLeaderboardSkeleton />,
  insights: <InsightsTabSkeleton />,
  notifications: <NotificationTabSkeleton />,
  activity: <div className="rounded-lg border p-4">Activity Skeleton</div>,
};

export function StudentDashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'summary';
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

  const pendingSkeleton = skeletonMap[activeTab] || <SummaryTabSkeleton />;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentDashboardTabs}
        basePath="/student"
        activeTab="tab"
      />
      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'summary' && <SummaryTab />}
            {currentTabFromUrl === 'leaderboard' && <ClassLeaderboard />}
            {currentTabFromUrl === 'insights' && <InsightTab />}
            {currentTabFromUrl === 'notifications' && <NotificationTab />}
            {currentTabFromUrl === 'activity' && <p>Activity Content...</p>}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
