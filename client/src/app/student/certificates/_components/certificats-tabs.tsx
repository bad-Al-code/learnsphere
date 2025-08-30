'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { studentCertificatesTabs } from '@/config/nav-items';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const skeletonMap: Record<string, React.ReactNode> = {
  certificates: <p>Loading Certificates...</p>,
  'in-progress': <p>Loading In Progress...</p>,
  achievements: <p>Loading Achievements...</p>,
  'digital-badges': <p>Loading Digital Badges...</p>,
  portfolio: <p>Loading Portfolio...</p>,
  settings: <p>Loading Settings...</p>,
  account: <p>Loading Account...</p>,
};

const contentMap: Record<string, React.ReactNode> = {
  certificates: <p>Certificates</p>,
  'in-progress': <p>In Progress</p>,
  achievements: <p>Achievements</p>,
  'digital-badges': <p>Digital Badges</p>,
  portfolio: <p>Portfolio</p>,
  settings: <p>Settings</p>,
  account: <p>Account</p>,
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
