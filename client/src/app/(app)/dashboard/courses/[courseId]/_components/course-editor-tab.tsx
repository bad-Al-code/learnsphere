'use client';

import { AppTabs } from '@/components/ui/app-tabs';
import { courseEditorTabs } from '@/config/nav-items';

interface CourseEditorProps {
  searchParams: { [key: string]: string | string[] | undefined };
  courseId: string;
}

export function CourseEditorTabs({
  searchParams,
  courseId,
}: CourseEditorProps) {
  const basePath = `/dashboard/courses/${courseId}`;

  return (
    <AppTabs tabs={courseEditorTabs} basePath={basePath} activeTab="tab" />
  );
}
