'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAnalyticsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

// A map of tab values to their loading messages
const skeletonMap: Record<string, React.ReactNode> = {
  performance: <p>Loading Performance...</p>,
  engagement: <p>Loading Engagement...</p>,
  'ai-insights': <p>Loading AI Insights...</p>,
};

// A map of tab values to their final content
const contentMap: Record<string, React.ReactNode> = {
  performance: <p>Performance</p>,
  engagement: <p>Engagement</p>,
  'ai-insights': <p>AI Insights</p>,
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
