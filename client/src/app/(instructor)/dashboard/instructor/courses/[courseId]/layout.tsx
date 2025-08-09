import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/app/(auth)/actions';
import { getCourseDetails } from '@/app/courses/actions';
import { CourseEditorTabs } from './_components/course-editor-tabs';

export default async function CourseEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;
  const [user, course] = await Promise.all([
    getCurrentUser(),
    getCourseDetails(courseId),
  ]);

  if (
    !user ||
    !course ||
    (user.userId !== course.instructorId && user.role !== 'admin')
  ) {
    redirect('/dashboard/instructor/courses');
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm">
        <Link href="/dashboard/instructor/courses" className="hover:underline">
          My Courses
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="truncate font-semibold">{course.title}</span>
      </div>

      {/* Title & Description */}
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2">
          {course.description || 'No description provided.'}
        </p>
      </div>

      {/* Tab Navigation */}
      <CourseEditorTabs courseId={courseId} />

      {/* The content for the active tab */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
