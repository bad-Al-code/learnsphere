import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCourseForEditor } from '../actions';
import { CourseEditor } from './_components/course-editor-tab';
import { PageHeader, PageHeaderSkeleton } from './_components/course-header';

interface CourseEditorPageProps {
  params: { courseId: string };
}

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
  const result = await getCourseForEditor(params.courseId);
  if (!result.success || !result.data) {
    notFound();
  }
  const course = result.data;

  return (
    <div className="space-y-2">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <PageHeader title={course.title} description={course.description} />
      </Suspense>

      <CourseEditor
        courseId={params.courseId}
        // initialOverviewData={overviewData}
      />
    </div>
  );
}
