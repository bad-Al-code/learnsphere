'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAssignmentsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AIReviewTab, AIReviewTabSkeleton } from './ai-review-tab';
import { AnalyticsTab, AnalyticsTabSkeleton } from './analytics-tab';
import {
  CollaborativeTab,
  CollaborativeTabSkeleton,
} from './collaborative-tab';
import { DraftsTab, DraftsTabSkeleton } from './drafts-tab';
import { PeerReviewTab, PeerReviewTabSkeleton } from './peer-review-tab';
import { PortfolioTab, PortfolioTabSkeleton } from './portfolio-tab';
import { SubmittedTab, SubmittedTabSkeleton } from './submitted-tab';
import { TemplatesTab, TemplatesTabSkeleton } from './templates-tab';
import { UpcomingTab, UpcomingTabSkeleton } from './upcoming-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  upcoming: <UpcomingTabSkeleton />,
  submitted: <SubmittedTabSkeleton />,
  drafts: <DraftsTabSkeleton />,
  'ai-review': <AIReviewTabSkeleton />,
  'peer-review': <PeerReviewTabSkeleton />,
  templates: <TemplatesTabSkeleton />,
  collaborative: <CollaborativeTabSkeleton />,
  portfolio: <PortfolioTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
};

export function AssignmentsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'upcoming';
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
    <Skeleton className="h-48 w-full" />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentAssignmentsTabs}
        basePath="/student/assignments"
        activeTab="tab"
      />
      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'upcoming' && <UpcomingTab />}
            {currentTabFromUrl === 'submitted' && <SubmittedTab />}
            {currentTabFromUrl === 'drafts' && <DraftsTab />}
            {currentTabFromUrl === 'ai-review' && <AIReviewTab />}
            {currentTabFromUrl === 'peer-review' && <PeerReviewTab />}
            {currentTabFromUrl === 'templates' && <TemplatesTab />}
            {currentTabFromUrl === 'collaborative' && <CollaborativeTab />}
            {currentTabFromUrl === 'portfolio' && <PortfolioTab />}
            {currentTabFromUrl === 'analytics' && <AnalyticsTab />}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
