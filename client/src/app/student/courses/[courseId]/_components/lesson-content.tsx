'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useState } from 'react';
import type { Lesson } from '../schema/course-detail.schema';
import { AssignmentLesson } from './lesson-types/assignment-lesson';
import { AudioLesson } from './lesson-types/audio-lesson';
import { QuizLesson } from './lesson-types/quiz-lesson';
import { ResourceLesson } from './lesson-types/resource-lesson';
import { TextLesson } from './lesson-types/text-lesson';
import { VideoLesson } from './lesson-types/video-lesson';

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-foreground text-3xl font-bold">
              {lesson.title}
            </h2>
            <p className="text-muted-foreground mt-2">{lesson.description}</p>
          </div>
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setIsCompleted(!isCompleted)}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium capitalize">
            {lesson.type}
          </span>
          <span className="text-muted-foreground text-xs">
            Duration: {lesson.duration} minutes
          </span>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="border-border bg-muted/30 rounded-lg border p-6">
        {lesson.type === 'video' && <VideoLesson lesson={lesson} />}
        {lesson.type === 'audio' && <AudioLesson lesson={lesson} />}
        {lesson.type === 'text' && <TextLesson lesson={lesson} />}
        {lesson.type === 'quiz' && <QuizLesson lesson={lesson} />}
        {lesson.type === 'assignment' && <AssignmentLesson lesson={lesson} />}
        {lesson.type === 'resource' && <ResourceLesson lesson={lesson} />}
      </div>

      {/* Navigation */}
      <div className="border-border flex items-center justify-between border-t pt-6">
        <Button variant="outline" className="gap-2 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Previous Lesson
        </Button>
        <Button className="gap-2">
          Next Lesson
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
