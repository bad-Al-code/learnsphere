'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentIntegrationsTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AllTabSkeleton } from '../skeletons/all-tab-skeleton';
import { AvailableTabSkeleton } from '../skeletons/available-tab-skeleton';
import { ConnectedTabSkeleton } from '../skeletons/connected-tab-skeleton';
import { AllTab } from './all-tab';
import { AvailableTab } from './available-tab';
import { ConnectedTab } from './connected-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  all: <AllTabSkeleton />,
  connected: <ConnectedTabSkeleton />,
  available: <AvailableTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  all: <AllTab />,
  connected: <ConnectedTab />,
  available: <AvailableTab />,
};

export function IntegrationsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'all';
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
    <p>Loading All Integrations...</p>
  );
  const activeContent = contentMap[currentTabFromUrl] || (
    <p>All Integrations</p>
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentIntegrationsTabs}
        basePath="/student/integrations"
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
