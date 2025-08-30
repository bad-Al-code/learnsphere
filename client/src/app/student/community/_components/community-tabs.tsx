'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCommunityTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const skeletonMap: Record<string, React.ReactNode> = {
  chat: <p>Loading Chat...</p>,
  'study-rooms': <p>Loading Study Rooms...</p>,
  projects: <p>Loading Projects...</p>,
  tutoring: <p>Loading Tutoring...</p>,
  events: <p>Loading Events...</p>,
  mentorship: <p>Loading Mentorship...</p>,
  leaderboard: <p>Loading Leaderboard...</p>,
  discussions: <p>Loading Discussions...</p>,
};

const contentMap: Record<string, React.ReactNode> = {
  chat: <p>Chat</p>,
  'study-rooms': <p>Study Rooms</p>,
  projects: <p>Projects</p>,
  tutoring: <p>Tutoring</p>,
  events: <p>Events</p>,
  mentorship: <p>Mentorship</p>,
  leaderboard: <p>Leaderboard</p>,
  discussions: <p>Discussions</p>,
};

export function CommunityTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'chat';
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

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading Chat...</p>;
  const activeContent = contentMap[currentTabFromUrl] || <p>Chat</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentCommunityTabs}
        basePath="/student/community"
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
