import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseDetails } from '../actions';
import { CourseEditorTabs } from './_components/course-editor-tab';

export default async function CourseEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;
  const course = await getCourseDetails(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 flex items-center text-sm">
        <Link
          href="/my-courses"
          className="text-muted-foreground hover:underline"
        >
          My Courses
        </Link>

        <ChevronRight className="text-muted-foreground mx-1 h-4 w-4" />
        <span className="truncate font-semibold">{course.title}</span>
      </div>

      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-muted-foreground mt-1">{course.description}</p>

      <div className="mt-6">
        <CourseEditorTabs courseId={courseId} />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
