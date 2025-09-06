import { getLessonDetails } from '@/app/(learn)/actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonEditor } from './_components/lesson-edtior';

interface LessonEditorPageProps {
  params: { courseId: string; lessonId: string };
}

export default async function LessonEditorPage({
  params,
}: LessonEditorPageProps) {
  const { courseId, lessonId } = params;

  const lesson = await getLessonDetails(lessonId);

  if (!lesson) {
    notFound();
  }

  console.log(lesson);

  return (
    <div className="">
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
            {lesson.lessonType} • {lesson.duration} min
          </p>
        </div>
      </div>

      <LessonEditor
        courseId={courseId}
        lessonId={lessonId}
        initialLessonData={lesson}
      />
    </div>
  );
}
