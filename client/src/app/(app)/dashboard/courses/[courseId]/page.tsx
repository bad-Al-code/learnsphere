import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCourseOverviewData } from '../actions';
import { CourseEditor } from './_components/course-editor-tab';
import { PageHeader, PageHeaderSkeleton } from './_components/course-header';

interface CourseEditorPageProps {
  params: { courseId: string };
}

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
  const overviewData = await getCourseOverviewData(params.courseId);
  const courseDetails = overviewData.details;
  if (!courseDetails) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <PageHeader
          title={courseDetails.title}
          description={courseDetails.description}
        />
      </Suspense>

      <CourseEditor
        courseId={params.courseId}
        initialOverviewData={overviewData}
      />
    </div>
  );
}
