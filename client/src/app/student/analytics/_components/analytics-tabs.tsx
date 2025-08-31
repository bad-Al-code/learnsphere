'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAnalyticsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AiInsightsTab, AiInsightsTabSkeleton } from './ai-insights-tab';
import { EngagementTab, EngagementTabSkeleton } from './engagement-tab';
import { PerformanceTab, PerformanceTabSkeleton } from './performance-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  performance: <PerformanceTabSkeleton />,
  engagement: <EngagementTabSkeleton />,
  'ai-insights': <AiInsightsTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  performance: <PerformanceTab />,
  engagement: <EngagementTab />,
  'ai-insights': <AiInsightsTab />,
};

export function AnalyticsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'performance';
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

  const pendingSkeleton = skeletonMap[activeTab] || (
    <p>Loading Performance...</p>
  );
  const activeContent = contentMap[currentTabFromUrl] || <p>Performance</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentAnalyticsTabs}
        basePath="/student/analytics"
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
