import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getLessonDetails } from '../../../../actions';
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
      <Link
        href={`/dashboard/instructor/courses/${params.courseId}/modules/${params.moduleId}`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Module
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Editing Lesson: {lesson.title}</CardTitle>
          <CardDescription>
            You can update the lesson's title, content, and attachments here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {lesson.lessonType === 'video' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Lesson Video</h3>
              <VideoUploader
                courseId={params.courseId}
                lessonId={params.lessonId}
                initialVideoUrl={lesson.contentId}
              />
            </div>
          )}
          {lesson.lessonType === 'text' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Lesson Content</h3>
              <p>Rich text editor for editing goes here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
