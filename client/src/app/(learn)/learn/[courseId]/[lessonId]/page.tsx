import { LessonControls } from '@/app/(learn)/_components/lesson-controls';
import { getCourseDetails } from '@/app/courses/actions';
import { VideoPlayer } from '@/components/video-player/video-player';
import { notFound, redirect } from 'next/navigation';
import { getEnrollmentProgress, getLessonDetails } from '../../../actions';

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = params;

  const [lesson, course, enrollment] = await Promise.all([
    getLessonDetails(lessonId),
    getCourseDetails(courseId),
    getEnrollmentProgress(courseId),
  ]);

  if (!lesson || !course || !enrollment) {
    notFound();
  }

  if (lesson.module.courseId !== courseId) {
    redirect(`/learn/${lesson.module.courseId}/${lesson.id}`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold md:text-3xl">{lesson.title}</h1>

        {lesson.lessonType === 'video' && lesson.contentId ? (
          <VideoPlayer src={lesson.contentId} />
        ) : lesson.lessonType === 'text' && lesson.textContent ? (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.textContent.content }}
          />
        ) : (
          <p className="text-muted-foreground">
            Content for this lesson is not available yet.
          </p>
        )}
      </div>

      <div className="border-t p-4">
        <LessonControls
          course={course}
          currentLessonId={lessonId}
          enrollment={enrollment}
        />
      </div>
    </div>
  );
}
