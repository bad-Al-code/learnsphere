'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { courseEditorTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useTransition } from 'react';

import { AnalyticsTab, AnalyticsTabSkeleton } from './analytics-tab';
import { AssignmentsTab, AssignmentsTabSkeleton } from './assignment-tab';
import { ContentTab, ContentTabSkeleton } from './content-tab';
import OverviewTab, { OverviewTabSkeleton } from './overview-tab';
import { ResourcesTab, ResourcesTabSkeleton } from './resources-tab';
import { SettingsTab, SettingsTabSkeleton } from './settings-tab';

interface CourseEditorProps {
  courseId: string;
  initialOverviewData: any;
}

const skeletonMap: Record<string, React.ReactNode> = {
  overview: <OverviewTabSkeleton />,
  content: <ContentTabSkeleton />,
  assignments: <AssignmentsTabSkeleton />,
  resources: <ResourcesTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
  settings: <SettingsTabSkeleton />,
};

export function CourseEditor({ courseId }: { courseId: string }) {
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

      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'overview' && (
              <Suspense fallback={<OverviewTabSkeleton />}>
                <OverviewTab courseId={courseId} />
              </Suspense>
            )}

            {currentTabFromUrl === 'content' && (
              <Suspense fallback={<ContentTabSkeleton />}>
                <ContentTab courseId={courseId} />
              </Suspense>
            )}

            {currentTabFromUrl === 'assignments' && (
              <Suspense fallback={<AssignmentsTabSkeleton />}>
                <AssignmentsTab />
              </Suspense>
            )}

            {currentTabFromUrl === 'resources' && (
              <Suspense fallback={<ResourcesTabSkeleton />}>
                <ResourcesTab />
              </Suspense>
            )}

            {currentTabFromUrl === 'analytics' && (
              <Suspense fallback={<AnalyticsTabSkeleton />}>
                <AnalyticsTab />
              </Suspense>
            )}
            {currentTabFromUrl === 'settings' && (
              <Suspense fallback={<SettingsTabSkeleton />}>
                <SettingsTab />
              </Suspense>
            )}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
