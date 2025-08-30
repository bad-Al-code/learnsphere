'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentAiToolsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const skeletonMap: Record<string, React.ReactNode> = {
  'ai-tutor': <p>Loading AI Tutor...</p>,
  'smart-notes': <p>Loading Smart Notes...</p>,
  'writing-assistant': <p>Loading Writing Assistant...</p>,
  flashcards: <p>Loading Flashcards...</p>,
  'voice-tutor': <p>Loading Voice Tutor...</p>,
  research: <p>Loading Research...</p>,
  analytics: <p>Loading Analytics...</p>,
  quiz: <p>Loading Quiz...</p>,
};

const contentMap: Record<string, React.ReactNode> = {
  'ai-tutor': <p>AI Tutor</p>,
  'smart-notes': <p>Smart Notes</p>,
  'writing-assistant': <p>Writing Assistant</p>,
  flashcards: <p>Flashcards</p>,
  'voice-tutor': <p>Voice Tutor</p>,
  research: <p>Research</p>,
  analytics: <p>Analytics</p>,
  quiz: <p>Quiz</p>,
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
