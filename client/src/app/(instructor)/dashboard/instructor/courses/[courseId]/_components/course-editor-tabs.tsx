'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  ListChecks,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const tabs = [
  {
    value: 'overview',
    label: 'Overview',
    href: (id: string) => `/dashboard/instructor/courses/${id}/overview`,
    icon: LayoutDashboard,
    matcher: (id: string, pathname: string) =>
      pathname === `/dashboard/instructor/courses/${id}/overview`,
  },
  {
    value: 'content',
    label: 'Content',
    href: (id: string) => `/dashboard/instructor/courses/${id}/content`,
    icon: ListChecks,
    matcher: (id: string, pathname: string) =>
      pathname.startsWith(`/dashboard/instructor/courses/${id}/content`) ||
      pathname.startsWith(`/dashboard/instructor/courses/${id}/modules`),
  },
  {
    value: 'assignments',
    label: 'Assignments',
    href: (id: string) => `/dashboard/instructor/courses/${id}/assignments`,
    icon: FileText,
    matcher: (id: string, pathname: string) =>
      pathname === `/dashboard/instructor/courses/${id}/assignments`,
  },
  {
    value: 'grades',
    label: 'Grades',
    href: (id: string) => `/dashboard/instructor/courses/${id}/grades`,
    icon: BarChart2,
    matcher: (id: string, pathname: string) =>
      pathname === `/dashboard/instructor/courses/${id}/grades`,
  },
  {
    value: 'settings',
    label: 'Settings',
    href: (id: string) => `/dashboard/instructor/courses/${id}/settings`,
    icon: Settings,
    matcher: (id: string, pathname: string) =>
      pathname.startsWith(`/dashboard/instructor/courses/${id}/settings`),
  },
] as const;

export function CourseEditorTabs({ courseId }: { courseId: string }) {
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const activeTab =
    tabs.find((tab) => tab.matcher(courseId, pathname))?.value || 'overview';

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="no-scrollbar flex w-full gap-2 overflow-x-auto sm:grid sm:grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-shrink-0 py-0 text-xs"
          >
            {isSmallScreen ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={tab.href(courseId)}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tab.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                href={tab.href(courseId)}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
