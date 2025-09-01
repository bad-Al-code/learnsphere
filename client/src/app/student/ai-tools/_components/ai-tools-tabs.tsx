'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAiToolsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
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

const contentMap: Record<string, React.ReactNode> = {
  'ai-tutor': <AiTutorTab />,
  'smart-notes': <SmartNotesTab />,
  'writing-assistant': <WritingAssistantTab />,
  flashcards: <FlashcardsTab />,
  'voice-tutor': <VoiceTutorTab />,
  research: <ResearchTab />,
  analytics: <AnalyticsTab />,
  quiz: <QuizTab />,
};

export function AiToolsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'ai-tutor';
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

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading AI Tutor...</p>;
  const activeContent = contentMap[currentTabFromUrl] || <p>AI Tutor</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentAiToolsTabs}
        basePath="/student/ai-tools"
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
