import { VideoPlayer } from "@/components/video-player/video-player";
import { notFound, redirect } from "next/navigation";
import { getLessonDetails } from "../../../actions";

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = params;

  const lesson = await getLessonDetails(lessonId);

  if (!lesson) {
    notFound();
  }

  if (lesson.module.courseId !== courseId) {
    redirect(`/learn/${lesson.module.courseId}/${lesson.id}`);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>

        {lesson.lessonType === "video" && lesson.contentId ? (
          <VideoPlayer src={lesson.contentId} />
        ) : lesson.lessonType === "text" && lesson.textContent ? (
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
        <p>Lesson Controls (Next/Prev, Mark as Complete) will go here.</p>
      </div>
    </div>
  );
}
