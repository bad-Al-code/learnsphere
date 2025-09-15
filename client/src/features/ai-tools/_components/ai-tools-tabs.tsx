'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAiToolsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

import { AiTutorTab, AiTutorTabSkeleton } from './ai-tutor-tab';
import { AnalyticsTab, AnalyticsTabSkeleton } from './analytics-tab';
import { FlashcardsTab, FlashcardsTabSkeleton } from './flashcards-tab';
import { QuizTab, QuizTabSkeleton } from './quiz-tab';
import { ResearchTab, ResearchTabSkeleton } from './research-tab';
import { SmartNotesTab, SmartNotesTabSkeleton } from './smart-notes-tab';
import { VoiceTutorTab, VoiceTutorTabSkeleton } from './voice-tutor-tab';
import {
  WritingAssistantTab,
  WritingAssistantTabSkeleton,
} from './writing-assignments-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  'ai-tutor': <AiTutorTabSkeleton />,
  'smart-notes': <SmartNotesTabSkeleton />,
  'writing-assistant': <WritingAssistantTabSkeleton />,
  flashcards: <FlashcardsTabSkeleton />,
  'voice-tutor': <VoiceTutorTabSkeleton />,
  research: <ResearchTabSkeleton />,
  analytics: <AnalyticsTabSkeleton />,
  quiz: <QuizTabSkeleton />,
};

const contentMap: Record<
  string,
  (props: { courseId?: string }) => React.ReactNode
> = {
  'ai-tutor': (props) => <AiTutorTab {...props} />,
  'smart-notes': (props) => <SmartNotesTab {...props} />,
  'writing-assistant': (props) => <WritingAssistantTab {...props} />,
  flashcards: (props) => <FlashcardsTab {...props} />,
  'voice-tutor': (props) => <VoiceTutorTab {...props} />,
  research: (props) => <ResearchTab {...props} />,
  analytics: (props) => <AnalyticsTab {...props} />,
  quiz: (props) => <QuizTab {...props} />,
};

export function AiToolsTabs({ courseId }: { courseId: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'ai-tutor';
  const [activeTab, setActiveTab] = useState(currentTabFromUrl);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setActiveTab(currentTabFromUrl);
  }, [currentTabFromUrl]);

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

  console.log('Current courseId:', courseId);
  console.log('Active tab:', activeTab);
  // if (!courseId) {
  //   return <p>CourseId is not provided</p>;
  // }

  const activeContent = contentMap[activeTab]?.({ courseId }) || (
    <p>Loading...</p>
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs tabs={studentAiToolsTabs} basePath="/" activeTab="tab" />
      <div>
        {isPending ? (
          skeletonMap[activeTab] || <p>Loading...</p>
        ) : (
          <TabsContent value={activeTab}>{activeContent}</TabsContent>
        )}
      </div>
    </Tabs>
  );
}
