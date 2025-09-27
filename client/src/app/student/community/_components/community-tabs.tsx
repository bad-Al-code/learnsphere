'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCommunityTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

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

const contentMap: Record<
  string,
  (props?: { courseId?: string }) => React.ReactNode
> = {
  chat: (props) => <ChatTab />,
  'study-rooms': (props) => <StudyRoomsTab />,
  projects: (props) => <ProjectsTab />,
  tutoring: (props) => <TutoringTab />,
  events: (props) => <EventsTab />,
  mentorship: (props) => <MentorshipTab />,
  leaderboard: (props) => <LeaderboardTab />,
  discussions: (props) => <DiscussionsTab {...props} />,
};

export function CommunityTabs({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'chat';
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

  const activeContent = contentMap[activeTab]?.({ courseId }) || (
    <p>Loading...</p>
  );
  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading...</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentCommunityTabs}
        basePath="/student/community"
        activeTab="tab"
      />
      <div>
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={activeTab}>{activeContent}</TabsContent>
        )}
      </div>
    </Tabs>
  );
}
