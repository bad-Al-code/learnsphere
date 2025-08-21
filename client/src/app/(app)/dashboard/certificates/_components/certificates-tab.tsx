'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AllCertificatesTabSkeleton } from './all-certificates-tab';
import { TemplatesTabSkeleton } from './templates-tab';
import { VerificationTabSkeleton } from './verification-tab';

const TABS_CONFIG = [
  { value: 'all-certificates', label: 'All Certificates' },
  { value: 'templates', label: 'Templates' },
  { value: 'verification', label: 'Verification' },
];

const skeletonMap: Record<string, React.ReactNode> = {
  'all-certificates': <AllCertificatesTabSkeleton />,
  templates: <TemplatesTabSkeleton />,
  verification: <VerificationTabSkeleton />,
};

export function CertificateTabsHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTabFromUrl = searchParams.get('tab') || 'all-certificates';
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
    <AllCertificatesTabSkeleton />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <AppTabs
        tabs={TABS_CONFIG.map((tab) => ({ ...tab, icon: 'Users', href: '#' }))}
        basePath="/dashboard/certificates"
        activeTab="tab"
      />
      <div className="mt-2">{isPending ? pendingSkeleton : children}</div>
    </Tabs>
  );
}
