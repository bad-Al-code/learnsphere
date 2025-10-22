import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Bookmark, CheckCircle2, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Lesson } from '../schema/course-detail.schema';
import { useCourseDetailStore } from '../store/course-detail.store';
import { AssignmentLesson } from './assignment-lesson';
import { AudioLesson } from './audio-lesson';
import { QuizLesson } from './quiz-lesson';
import { ResourceLesson } from './resource-lesson';
import { TextLesson } from './text-lesson';
import { VideoLesson } from './video-lesson';

interface LessonViewerProps {
  lesson: Lesson | undefined;
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const { markLessonComplete, toggleLessonBookmark } = useCourseDetailStore();
  const [showComments, setShowComments] = useState(false);

  if (!lesson) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="No Lesson Selected"
          description="Select a lesson from the sidebar to begin learning."
          icon="book"
        />
      </div>
    );
  }

  const handleMarkComplete = () => {
    markLessonComplete(lesson.id);
  };

  const handleToggleBookmark = () => {
    toggleLessonBookmark(lesson.id);
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return <VideoLesson lesson={lesson} />;
      case 'text':
        return <TextLesson lesson={lesson} />;
      case 'audio':
        return <AudioLesson lesson={lesson} />;
      case 'quiz':
        return <QuizLesson lessonId={lesson.id} />;
      case 'assignment':
        return <AssignmentLesson lessonId={lesson.id} />;
      case 'resource':
        return <ResourceLesson lessonId={lesson.id} />;
      default:
        return (
          <EmptyState
            title="Unsupported Lesson Type"
            description={`The lesson type "${lesson.type}" is not yet supported.`}
            icon="file"
          />
        );
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleMarkComplete}
              variant={lesson.completed ? 'default' : 'outline'}
              className="gap-2"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              {lesson.completed ? 'Completed' : 'Mark as Complete'}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleBookmark}
              className={
                lesson.bookmarked ? 'bg-yellow-50 dark:bg-yellow-950' : ''
              }
              size="sm"
            >
              <Bookmark
                className={`h-4 w-4 ${lesson.bookmarked ? 'fill-current text-yellow-500' : ''}`}
              />
            </Button>

            <Button variant="outline" className="gap-2" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        {renderLessonContent()}

        <Card className="p-4 sm:p-6">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-primary mb-4 flex items-center gap-2 font-semibold transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            Discussion ({showComments ? 'Hide' : 'Show'})
          </button>

          {showComments && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                      <span className="text-sm font-medium">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-medium">John Doe</p>
                        <span className="text-muted-foreground text-xs">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Great explanation! This really helped me understand the
                        concepts better.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                      <span className="text-sm font-medium">JS</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-medium">Jane Smith</p>
                        <span className="text-muted-foreground text-xs">
                          5 hours ago
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Can you provide more examples of this in real-world
                        applications?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <textarea
                  className="bg-background focus:ring-ring min-h-[100px] w-full resize-none rounded-md border p-3 focus:ring-2 focus:outline-none"
                  placeholder="Add your comment..."
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
