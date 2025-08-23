'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { NavItem } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import {
  TemplatesTab,
  TemplatesTabSkeleton,
} from '../../certificates/_components/templates-tab';
import {
  PageHeader,
  PageHeaderSkeleton,
} from '../../courses/[courseId]/_components/course-header';
import {
  AnnouncementsPage,
  AnnouncementsPageSkeleton,
} from '../announcements/announcement-page';
import { ComposePage, ComposePageSkeleton } from '../compose/compose-page';
import { MessagesPage, MessagesPageSkeleton } from '../messages/mesage-page';

const communicationTabs: NavItem[] = [
  { value: 'messages', label: 'Messages', icon: 'Mail', href: '#' },
  { value: 'compose', label: 'Compose', icon: 'Pencil', href: '#' },
  {
    value: 'announcements',
    label: 'Announcements',
    icon: 'Megaphone',
    href: '#',
  },
  { value: 'templates', label: 'Templates', icon: 'FileText', href: '#' },
];

const skeletonMap: Record<string, React.ReactNode> = {
  messages: <MessagesPageSkeleton />,
  compose: <ComposePageSkeleton />,
  announcements: <AnnouncementsPageSkeleton />,
  templates: <TemplatesTabSkeleton />,
};

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Communication Hub"
        description="Manage all student and course-related communication from one place."
      />

      <CommunicationTabsHandler>
        <TabsContent value="messages">
          <MessagesPage />
        </TabsContent>
        <TabsContent value="compose">
          <ComposePage />
        </TabsContent>
        <TabsContent value="announcements">
          <AnnouncementsPage />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>
      </CommunicationTabsHandler>
    </div>
  );
}

function CommunicationTabsHandler({ children }: { children: React.ReactNode }) {
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
      <div className="mt-6">{isPending ? pendingSkeleton : children}</div>
    </Tabs>
  );
}

export function CommunicationPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: communicationTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <MessagesPageSkeleton />
      </div>
    </div>
  );
}
