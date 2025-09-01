'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCommunityTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { ChatTab, ChatTabSkeleton } from './chat-tab';
import { DiscussionsTab, DiscussionsTabSkeleton } from './discussions-tab';
import { EventsTab, EventsTabSkeleton } from './events-tab';
import { LeaderboardTab, LeaderboardTabSkeleton } from './leaderboard-tab';
import { MentorshipTab, MentorshipTabSkeleton } from './mentorship-tab';
import { ProjectsTab, ProjectsTabSkeleton } from './projects-tab';
import { StudyRoomsTab, StudyRoomsTabSkeleton } from './study-rooms-tab';
import { TutoringTab, TutoringTabSkeleton } from './tutoring-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  chat: <ChatTabSkeleton />,
  'study-rooms': <StudyRoomsTabSkeleton />,
  projects: <ProjectsTabSkeleton />,
  tutoring: <TutoringTabSkeleton />,
  events: <EventsTabSkeleton />,
  mentorship: <MentorshipTabSkeleton />,
  leaderboard: <LeaderboardTabSkeleton />,
  discussions: <DiscussionsTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  chat: <ChatTab />,
  'study-rooms': <StudyRoomsTab />,
  projects: <ProjectsTab />,
  tutoring: <TutoringTab />,
  events: <EventsTab />,
  mentorship: <MentorshipTab />,
  leaderboard: <LeaderboardTab />,
  discussions: <DiscussionsTab />,
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
