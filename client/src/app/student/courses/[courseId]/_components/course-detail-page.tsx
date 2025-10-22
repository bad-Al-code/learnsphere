'use client';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCourseDetail } from '../hooks/use-course-detail';
import { useCourseDetailStore } from '../store/course-detail.store';
import { AIChatSidebar } from './ai-chat-sidebar';
import {
  CourseHeaderSkeleton,
  LessonViewerSkeleton,
  ModuleSidebarSkeleton,
} from './course-details-skeleton';
import { CourseHeader } from './course-header';
import { LessonViewer } from './lesson-viewer';
import { ModulesSidebar } from './module-sidebar';

export function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const {
    data: courseDetail,
    isLoading,
    error,
    refetch,
  } = useCourseDetail(courseId);

  const {
    selectedLessonId,
    setSelectedLessonId,
    setCourseDetail,
    isAIChatOpen,
    toggleAIChat,
    isSidebarCollapsed,
    toggleSidebar,
  } = useCourseDetailStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (courseDetail) {
      setCourseDetail(courseDetail);

      if (!selectedLessonId) {
        const lastAccessedLesson = courseDetail.modules
          .flatMap((m) => m.lessons)
          .find((l) => l.id === courseDetail.lastAccessedLessonId);

        const firstIncompleteLesson = courseDetail.modules
          .flatMap((m) => m.lessons)
          .find((l) => !l.completed && !l.locked);

        const firstLesson = courseDetail.modules[0]?.lessons[0];

        const lessonToSelect =
          lastAccessedLesson || firstIncompleteLesson || firstLesson;

        if (lessonToSelect) {
          setSelectedLessonId(lessonToSelect.id);
        }
      }
    }
  }, [courseDetail, selectedLessonId, setSelectedLessonId, setCourseDetail]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col">
        <CourseHeaderSkeleton />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r">
            <ModuleSidebarSkeleton />
          </div>
          <div className="flex-1">
            <LessonViewerSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <ErrorState message="Course not found" />
      </div>
    );
  }

  const selectedLesson = courseDetail.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === selectedLessonId);

  if (!isClient || (typeof window !== 'undefined' && window.innerWidth < 768)) {
    return (
      <div className="flex h-screen flex-col">
        <CourseHeader course={courseDetail} />

        <div className="flex flex-1 flex-col overflow-hidden">
          {isSidebarCollapsed ? (
            <>
              <div className="flex items-center justify-between border-b p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebar}
                  className="gap-2"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                  Course Content
                </Button>
                {isAIChatOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAIChat}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex flex-1 overflow-hidden">
                <LessonViewer lesson={selectedLesson} />

                {isAIChatOpen && (
                  <div className="hidden w-96 border-l md:block">
                    <AIChatSidebar
                      lessonId={selectedLessonId || ''}
                      lessonTitle={selectedLesson?.title || ''}
                      onClose={toggleAIChat}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative flex-1 overflow-hidden">
              <div className="bg-background absolute inset-0 z-10">
                <div className="flex h-full flex-col">
                  <div className="border-b p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSidebar}
                      className="gap-2"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                      Close
                    </Button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ModulesSidebar
                      // modules={courseDetail.modules}
                      selectedLesson={selectedLessonId!}
                      onSelectLesson={(id) => {
                        setSelectedLessonId(id);
                        toggleSidebar();
                      }}
                      // courseProgress={courseDetail.progressPercentage}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <CourseHeader course={courseDetail} />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {!isSidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <ModulesSidebar
                  // modules={courseDetail.modules}
                  selectedLesson={selectedLessonId!}
                  onSelectLesson={setSelectedLessonId}
                  // courseProgress={courseDetail.progressPercentage}
                />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          <ResizablePanel defaultSize={isAIChatOpen ? 55 : 80} minSize={40}>
            <div className="flex h-full flex-col">
              {isSidebarCollapsed && (
                <div className="border-b p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSidebar}
                    className="gap-2"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                    Course Content
                  </Button>
                </div>
              )}
              <LessonViewer lesson={selectedLesson} />
            </div>
          </ResizablePanel>

          {isAIChatOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                <AIChatSidebar
                  lessonId={selectedLessonId || ''}
                  lessonTitle={selectedLesson?.title || ''}
                  onClose={toggleAIChat}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {!isAIChatOpen && (
        <Button
          onClick={toggleAIChat}
          size="icon"
          className="fixed right-4 bottom-4 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
