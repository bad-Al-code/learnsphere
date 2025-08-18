'use client';

import { usePathname } from 'next/navigation';

import { AppTabs } from '@/components/ui/app-tabs';
import { Tabs } from '@/components/ui/tabs';
import { NavItem } from '@/types';

const courseEditorTabs: NavItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'LayoutDashboard',
    href: '/overview',
  },
  { value: 'content', label: 'Content', icon: 'ListChecks', href: '/content' },
  {
    value: 'assignments',
    label: 'Assignments',
    icon: 'FileText',
    href: '/assignments',
  },
  { value: 'resources', label: 'Resources', icon: 'File', href: '/resources' },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: 'AreaChart',
    href: '/analytics',
  },
  { value: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
];

export function CourseEditorTabs({ courseId }: { courseId: string }) {
  const pathname = usePathname();
  const basePath = `/dashboard/courses/${courseId}`;
  const activeTab = pathname.split('/').pop() || 'overview';

  const tabsWithFullPath = courseEditorTabs.map((tab) => ({
    ...tab,
    href: basePath + tab.href,
  }));

  return (
    <Tabs>
      <AppTabs
        tabs={tabsWithFullPath}
        basePath={basePath}
        activeTab={activeTab}
      />
    </Tabs>
  );
}
