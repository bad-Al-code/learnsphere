import { ArrowLeft, FileText, Video } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { IconBadge } from '@/components/shared/icon-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getLessonDetails } from '../../../../actions';
import { EditTextContentForm } from './_components/edit-text-content-form';
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
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-2">
          <Link
            href={`/dashboard/instructor/courses/${params.courseId}/modules/${params.moduleId}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Lesson Editor</h1>
        <p className="text-muted-foreground text-sm">
          Update lesson details, content, and resources.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileText} />
              <div className="space-y-1">
                <CardTitle>Customize your Lesson</CardTitle>
                <CardDescription>
                  Edit the lesson title so it’s clear and easy for students to
                  understand.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <EditTitleForm
              courseId={params.courseId}
              lessonId={params.lessonId}
              initialTitle={lesson.title}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <div className="space-y-1">
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>
                  Upload videos or add written content for your students to
                  learn from.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {lesson.lessonType === 'video' && (
              <VideoUploader
                courseId={params.courseId}
                lessonId={params.lessonId}
                initialVideoUrl={lesson.contentId}
              />
            )}
            {lesson.lessonType === 'text' && (
              <EditTextContentForm
                courseId={params.courseId}
                lessonId={params.lessonId}
                initialContent={lesson.textContent?.content}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
