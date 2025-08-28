'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs } from '@/components/ui/tabs';
import { courseEditorTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { AnalyticsTabSkeleton } from './analytics-tab';
import { AssignmentsTabSkeleton } from './assignment-tab';
import { ContentTabSkeleton } from './content-tab';
import { OverviewTabSkeleton } from './overview-tab';
import { ResourcesTabSkeleton } from './resources-tab';
import { SettingsTabSkeleton } from './settings-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  overview: <OverviewTabSkeleton />,
  content: <ContentTabSkeleton />,
  assignments: <AssignmentsTabSkeleton />,
  resources: <ResourcesTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
  settings: <SettingsTabSkeleton />,
};

interface CourseEditorTabsProps {
  courseId: string;
  children: React.ReactNode;
}

export function CourseEditorTabs({
  courseId,
  children,
}: CourseEditorTabsProps) {
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
        tabs={courseEditorTabs}
        basePath={`/dashboard/courses/${courseId}`}
        activeTab="tab"
      />
      <div className="">{isPending ? pendingSkeleton : children}</div>
    </Tabs>
  );
}
