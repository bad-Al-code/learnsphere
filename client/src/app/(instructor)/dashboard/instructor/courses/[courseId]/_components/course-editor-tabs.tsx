"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    value: "overview",
    label: "Overview",
    href: (id: string) => `/dashboard/instructor/courses/${id}/overview`,
  },
  {
    value: "content",
    label: "Content",
    href: (id: string) => `/dashboard/instructor/courses/${id}/content`,
  },
];

export function CourseEditorTabs({ courseId }: { courseId: string }) {
  const pathname = usePathname();

  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.href(courseId)))?.value ||
    "overview";

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={tab.href(courseId)}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
