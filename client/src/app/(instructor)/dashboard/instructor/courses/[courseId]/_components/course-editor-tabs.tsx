'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  ListChecks,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    value: 'overview',
    label: 'Overview',
    href: (id: string) => `/dashboard/instructor/courses/${id}/overview`,
    icon: LayoutDashboard,
  },
  {
    value: 'content',
    label: 'Content',
    href: (id: string) => `/dashboard/instructor/courses/${id}/content`,
    icon: ListChecks,
  },
  {
    value: 'assignments',
    label: 'Assignments',
    href: (id: string) => `/dashboard/instructor/courses/${id}/assignments`,
    icon: FileText,
  },
  {
    value: 'grades',
    label: 'Grades',
    href: (id: string) => `/dashboard/instructor/courses/${id}/grades`,
    icon: BarChart2,
  },
  {
    value: 'settings',
    label: 'Settings',
    href: (id: string) => `/dashboard/instructor/courses/${id}/settings`,
    icon: Settings,
  },
] as const;

export function CourseEditorTabs({ courseId }: { courseId: string }) {
  const pathname = usePathname();

  const activeTab =
    tabs
      .slice()
      .sort((a, b) => b.href(courseId).length - a.href(courseId).length)
      .find((tab) => pathname.startsWith(tab.href(courseId)))?.value ||
    'overview';

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 gap-4 px-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            asChild
            className="text-[12px] sm:text-sm"
          >
            <Link
              href={tab.href(courseId)}
              className="flex items-center gap-0 sm:gap-1"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
