import { ArrowLeft, FileText, Video } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { IconBadge } from '@/components/shared/icon-badge';
import { getLessonDetails } from '../../../../actions';
import { EditTitleForm } from './_components/edit-title-form';
import { VideoUploader } from './_components/video-uploader';

export default async function EditLessonPage({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string };
}) {
  const lesson = await getLessonDetails(params.lessonId);
  if (!lesson) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/dashboard/instructor/courses/${params.courseId}/modules/${params.moduleId}`}
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Module
          </Link>
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Lesson Editor</h1>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileText} />
              <h2 className="text-xl">Customize your Lesson</h2>
            </div>
            <EditTitleForm
              courseId={params.courseId}
              lessonId={params.lessonId}
              initialTitle={lesson.title}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Lesson Content</h2>
            </div>
            {lesson.lessonType === 'video' && (
              <div className="mt-6 rounded-md border bg-slate-100 p-4 dark:bg-slate-800">
                <VideoUploader
                  courseId={params.courseId}
                  lessonId={params.lessonId}
                  initialVideoUrl={lesson.contentId}
                />
              </div>
            )}
            {lesson.lessonType === 'text' && (
              <div className="mt-6 rounded-md border bg-slate-100 p-4 dark:bg-slate-800">
                <p>Rich text editor for editing goes here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
