import { getCourseDetails } from '@/app/courses/actions';
import { redirect } from 'next/navigation';
import { CourseSidebar } from '../../_components/course-sidebar';
import { checkEnrollmentStatus } from '../../actions';

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;

  const enrollment = await checkEnrollmentStatus(courseId);
  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  const course = await getCourseDetails(courseId);
  if (!course) {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex h-full">
      <div className="fixed hidden h-full w-80 flex-col md:flex">
        <CourseSidebar course={course} />
      </div>
      <main className="w-full md:pl-80">{children}</main>
    </div>
  );
}
