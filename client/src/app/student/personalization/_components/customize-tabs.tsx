'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentPersonalizationTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import {
  AccessibilityTab,
  AccessibilityTabSkeleton,
} from './accessibility-tab';
import { LayoutTab, LayoutTabSkeleton } from './layout-tab';
import { PreferencesTab, PreferencesTabSkeleton } from './preferences-tab';
import { ThemesTab, ThemesTabSkeleton } from './themes-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  themes: <ThemesTabSkeleton />,
  layout: <LayoutTabSkeleton />,
  preferences: <PreferencesTabSkeleton />,
  accessibility: <AccessibilityTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  themes: <ThemesTab />,
  layout: <LayoutTab />,
  preferences: <PreferencesTab />,
  accessibility: <AccessibilityTab />,
};

export function PersonalizationTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'themes';
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

  const pendingSkeleton = skeletonMap[activeTab] || <p>Loading Themes...</p>;
  const activeContent = contentMap[currentTabFromUrl] || <p>Themes</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentPersonalizationTabs}
        basePath="/student/personalization"
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
