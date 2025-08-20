import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonEditor } from './_components/lesson-edtior';

interface LessonEditorPageProps {
  params: { courseId: string; lessonId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LessonEditorPage({
  params,
}: LessonEditorPageProps) {
  const lesson = {
    title: 'What is Data Science?',
    type: 'video',
    duration: '15 min',
  };

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="-ml-4">
          <Link
            href={`/dashboard/courses/${params.courseId}?tab=content`}
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Content
          </Link>
        </Button>
        <div className="mt-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">
            {lesson.type} • {lesson.duration}
          </p>
        </div>
      </div>

      <LessonEditor courseId={params.courseId} lessonId={params.lessonId} />
    </div>
  );
}
