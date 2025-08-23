'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { communicationTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import {
  AnnouncementsPage,
  AnnouncementsPageSkeleton,
} from '../announcements/announcement-page';
import { ComposePage, ComposePageSkeleton } from '../compose/compose-page';
import { MessagesPage, MessagesPageSkeleton } from '../messages/mesage-page';
import {
  MessageTemplatesTab,
  MessageTemplateTabSkeleton,
} from './template-card-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  messages: <MessagesPageSkeleton />,
  compose: <ComposePageSkeleton />,
  announcements: <AnnouncementsPageSkeleton />,
  templates: <MessageTemplateTabSkeleton />,
};

export function CommunicationTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'messages';
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

  const pendingSkeleton = skeletonMap[activeTab] || <MessagesPageSkeleton />;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={communicationTabs}
        basePath="/dashboard/communication"
        activeTab="tab"
      />
      <div className="">
        {isPending ? (
          pendingSkeleton
        ) : (
          <TabsContent value={currentTabFromUrl}>
            {currentTabFromUrl === 'messages' && <MessagesPage />}
            {currentTabFromUrl === 'compose' && <ComposePage />}
            {currentTabFromUrl === 'announcements' && <AnnouncementsPage />}
            {currentTabFromUrl === 'templates' && <MessageTemplatesTab />}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
