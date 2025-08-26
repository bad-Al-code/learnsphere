import { notFound } from 'next/navigation';
import { getCourseDetailsForEditor } from '../actions';
import { CourseEditor } from './_components/course-editor-tab';
import { PageHeader } from './_components/course-header';

interface CourseEditorPageProps {
  params: { courseId: string };
}

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
  const result = await getCourseDetailsForEditor(params.courseId);

  if (!result.success || !result.data) {
    notFound();
  }

  const course = result.data;

  return (
    <div className="space-y-2">
      <PageHeader title={course.title} description={course.description} />

      <CourseEditor courseId={params.courseId} />
    </div>
  );
}
