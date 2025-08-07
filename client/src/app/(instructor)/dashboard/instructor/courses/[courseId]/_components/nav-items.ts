import {
  BarChart2,
  FileText,
  LayoutDashboard,
  ListChecks,
  Settings,
} from "lucide-react";

export const courseNavItems = (courseId: string) =>
  [
    {
      href: `/dashboard/instructor/courses/${courseId}/overview`,
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: `/dashboard/instructor/courses/${courseId}/content`,
      label: "Content",
      icon: ListChecks,
    },
    {
      href: `/dashboard/instructor/courses/${courseId}/assignments`,
      label: "Assignments",
      icon: FileText,
    },
    {
      href: `/dashboard/instructor/courses/${courseId}/grades`,
      label: "Grades",
      icon: BarChart2,
    },
    {
      href: `/dashboard/instructor/courses/${courseId}/settings`,
      label: "Settings",
      icon: Settings,
    },
  ] as const;
