'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCertificatesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AchievementsTab, AchievementsTabSkeleton } from './achievements-tab';
import { CertificatesTab, CertificatesTabSkeleton } from './certificates-tab';
import { InProgressTab, InProgressTabSkeleton } from './in-progress-tab';

const skeletonMap: Record<string, React.ReactNode> = {
  certificates: <CertificatesTabSkeleton />,
  'in-progress': <InProgressTabSkeleton />,
  achievements: <AchievementsTabSkeleton />,
  // 'digital-badges': <DigitalBadgesTabSkeleton />,
  // portfolio: <PortfolioTabSkeleton />,
};

const contentMap: Record<string, React.ReactNode> = {
  certificates: <CertificatesTab />,
  'in-progress': <InProgressTab />,
  achievements: <AchievementsTab />,
  // 'digital-badges': <DigitalBadgesTab />,
  // portfolio: <PortfolioTab />,
};

export function CertificatesTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'certificates';
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
    <p>Loading Certificates...</p>
  );
  const activeContent = contentMap[currentTabFromUrl] || <p>Certificates</p>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={studentCertificatesTabs}
        basePath="/student/certificates"
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
