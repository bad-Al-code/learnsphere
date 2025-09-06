'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { lessonEditorTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

import { useLesson } from '@/hooks/use-lesson';
import { LessonAnalyticsTabSkeleton } from './lesson-analytics-tab';
import {
  LessonContentTab,
  LessonContentTabSkeleton,
} from './lesson-content-tab';
import { LessonDiscussionTabSkeleton } from './lesson-disscussion-tab';
import { LessonSettingsTabSkeleton } from './lesson-settings-tab';
import { LessonStudentsTabSkeleton } from './lesson-students-tab';

interface LessonEditorProps {
  courseId: string;
  lessonId: string;
  initialLessonData: any;
}

const skeletonMap: Record<string, React.ReactNode> = {
  content: <LessonContentTabSkeleton />,
  analytics: <LessonAnalyticsTabSkeleton />,
  students: <LessonStudentsTabSkeleton />,
  comments: <LessonDiscussionTabSkeleton />,
  settings: <LessonSettingsTabSkeleton />,
};

export function LessonEditor({
  courseId,
  lessonId,
  initialLessonData,
}: LessonEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTabFromUrl = searchParams.get('tab') || 'content';

  const [activeTab, setActiveTab] = useState(currentTabFromUrl);
  const [isPending, startTransition] = useTransition();

  const {
    data: lesson,
    isLoading,
    error,
  } = useLesson(lessonId, initialLessonData);

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

  if (isLoading) {
    return pendingSkeleton;
  }
  if (error) {
    return <p className="text-destructive">Error loading lesson data.</p>;
  }

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
            <TabsContent value={currentTabFromUrl}>
              {currentTabFromUrl === 'content' && (
                <LessonContentTab lesson={lesson} />
              )}
            </TabsContent>

            {/* <TabsContent value="analytics">
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
            </TabsContent> */}
          </>
        )}
      </div>
    </Tabs>
  );
}
