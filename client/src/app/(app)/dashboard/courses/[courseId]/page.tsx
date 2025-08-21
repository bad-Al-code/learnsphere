import { notFound } from 'next/navigation';
import { getCourseDetails } from '../actions';
import { CourseEditor } from './_components/course-editor-tab';
import { PageHeader } from './_components/course-header';

interface CourseEditorPageProps {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CourseEditorPage({
  params,
  searchParams,
}: CourseEditorPageProps) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <PageHeader title={course.title} description={course.description} />

      <CourseEditor courseId={params.courseId} />
    </div>
  );
}
