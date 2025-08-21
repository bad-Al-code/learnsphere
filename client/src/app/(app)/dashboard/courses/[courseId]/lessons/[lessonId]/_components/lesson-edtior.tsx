'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { lessonEditorTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useTransition } from 'react';

import {
  LessonAnalyticsTab,
  LessonAnalyticsTabSkeleton,
} from './lesson-analytics-tab';
import {
  LessonContentTab,
  LessonContentTabSkeleton,
} from './lesson-content-tab';
import {
  DiscussionTab,
  LessonDiscussionTabSkeleton,
} from './lesson-disscussion-tab';
import {
  LessonSettingsTab,
  LessonSettingsTabSkeleton,
} from './lesson-settings-tab';
import {
  LessonStudentsTab,
  LessonStudentsTabSkeleton,
} from './lesson-students-tab';

interface LessonEditorProps {
  courseId: string;
  lessonId: string;
}

const skeletonMap: Record<string, React.ReactNode> = {
  content: <LessonContentTabSkeleton />,
  analytics: <LessonAnalyticsTabSkeleton />,
  students: <LessonStudentsTabSkeleton />,
  comments: <LessonDiscussionTabSkeleton />,
  settings: <LessonSettingsTabSkeleton />,
};

export function LessonEditor({ courseId, lessonId }: LessonEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTabFromUrl = searchParams.get('tab') || 'content';

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
    <LessonContentTabSkeleton />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={lessonEditorTabs}
        basePath={`/dashboard/courses/${courseId}/lessons/${lessonId}`}
        activeTab="tab"
      />

      <div className="mt-0">
        {isPending ? (
          pendingSkeleton
        ) : (
          <>
            <TabsContent value="content">
              <Suspense fallback={<LessonContentTabSkeleton />}>
                <LessonContentTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="analytics">
              <Suspense fallback={<LessonAnalyticsTabSkeleton />}>
                <LessonAnalyticsTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="students">
              <Suspense fallback={<LessonStudentsTabSkeleton />}>
                <LessonStudentsTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="comments">
              <Suspense fallback={<LessonDiscussionTabSkeleton />}>
                <DiscussionTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="settings">
              <Suspense fallback={<LessonSettingsTabSkeleton />}>
                <LessonSettingsTab />
              </Suspense>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
