"use client";

import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { markLessonComplete } from "../actions";

type Lesson = { id: string; title: string };
type Module = { id: string; title: string; lessons: Lesson[] };
type Course = { id: string; modules: Module[] };
type Enrollment = { progress: { completedLessons: string[] } };

interface LessonControlsProps {
  course: Course;
  currentLessonId: string;
  enrollment: Enrollment;
}

export function LessonControls({
  course,
  currentLessonId,
  enrollment,
}: LessonControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);
  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === currentLessonId
  );
  const prevLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  const isCompleted =
    enrollment.progress.completedLessons.includes(currentLessonId);

  const handleMarkComplete = () => {
    startTransition(async () => {
      const result = await markLessonComplete(course.id, currentLessonId);
      if (result.error) {
        toast.error("Failed to update progress", { description: result.error });
      } else {
        toast.success("Progress updated!");
        if (nextLesson) {
          router.push(`/learn/${course.id}/${nextLesson.id}`);
        }
      }
    });
  };

  return (
    <div className="flex flex-row md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {prevLesson && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/learn/${course.id}/${prevLesson.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Link>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={handleMarkComplete}
          disabled={isPending || isCompleted}
          size="sm"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-5 w-5 mr-1" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-5 w-5 mr-1" />
              Mark as Complete
            </>
          )}
        </Button>
      </div>
      {nextLesson && (
        <Button asChild variant="outline" size="sm">
          <Link href={`/learn/${course.id}/${nextLesson.id}`}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}
