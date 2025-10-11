'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAssignmentsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
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
  'peer-review': <PeerReviewTabSkeleton />,
  templates: <TemplatesTabSkeleton />,
  collaborative: <CollaborativeTabSkeleton />,
  portfolio: <PortfolioTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
};

const contentMap: Record<
  string,
  (props?: { courseId?: string }) => React.ReactNode
> = {
  upcoming: (props) => <UpcomingTab />,
  submitted: (props) => <SubmittedTab />,
  drafts: (props) => <DraftsTab {...props} />,
  'peer-review': (props) => <PeerReviewTab />,
  templates: (props) => <TemplatesTab />,
  collaborative: (props) => <CollaborativeTab />,
  portfolio: (props) => <PortfolioTab />,
  analytics: (props) => <AnalyticsTab {...props} />,
};

export function AssignmentsTabs({ courseId }: { courseId?: string }) {
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
    if (courseId) {
      params.set('courseId', courseId);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const activeContent = contentMap[activeTab]?.({ courseId }) || (
    <Skeleton className="h-48 w-full" />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentAssignmentsTabs}
        basePath="/student/assignments"
        activeTab="tab"
      />
      <div>
        {isPending ? (
          skeletonMap[activeTab] || <Skeleton className="h-48 w-full" />
        ) : (
          <TabsContent value={activeTab}>{activeContent}</TabsContent>
        )}
      </div>
    </Tabs>
  );
}
