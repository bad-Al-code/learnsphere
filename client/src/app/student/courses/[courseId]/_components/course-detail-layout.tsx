'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, ChevronLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCourseDetail } from '../hooks/use-course-detail';
import { AssignmentsTab } from './assignments-tab';
import { CourseDetailSkeleton } from './course-detail-skeleton';
import { DiscussionsTab } from './discussions-tab';
import { LessonContent } from './lesson-content';
import { ProgressTab } from './progress-tab';
import { ResourcesTab } from './resources-tab';
import { SettingsPanel } from './settings-panel';

// Export as default export
const CourseDetailLayout = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    data: courseDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseDetail(courseId);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            {error?.message || 'Failed to load course'}
          </p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  // Set default selections
  if (!selectedModuleId && courseDetail.modules.length > 0) {
    setSelectedModuleId(courseDetail.modules[0].id);
  }

  const selectedModule = courseDetail.modules.find(
    (m) => m.id === selectedModuleId
  );
  const selectedLesson = selectedModule?.lessons.find(
    (l) => l.id === selectedLessonId
  );

  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Header */}
      <div className="border-border bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                {courseDetail.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {courseDetail.instructor.firstName}{' '}
                {courseDetail.instructor.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm font-medium">
              Progress: {courseDetail.progressPercentage.toFixed(0)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Modules */}
        <ModuleSidebar
          modules={courseDetail.modules}
          selectedModuleId={selectedModuleId}
          selectedLessonId={selectedLessonId}
          onModuleSelect={setSelectedModuleId}
          onLessonSelect={setSelectedLessonId}
        />

        {/* Center Content */}
        <div className="flex-1 overflow-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <div className="border-border bg-card sticky top-0 z-10 border-b px-6 py-3">
              <TabsList className="bg-muted">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
            </div>

            <div className="overflow-auto">
              <TabsContent value="lessons" className="m-0 p-6">
                {selectedLesson ? (
                  <LessonContent lesson={selectedLesson} />
                ) : (
                  <div className="border-border flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground">
                      Select a lesson to begin
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="assignments" className="m-0 p-6">
                <AssignmentsTab
                  moduleId={selectedModuleId}
                  assignments={courseDetail.assignments}
                />
              </TabsContent>

              <TabsContent value="discussions" className="m-0 p-6">
                <DiscussionsTab courseId={courseId} />
              </TabsContent>

              <TabsContent value="progress" className="m-0 p-6">
                <ProgressTab courseDetail={courseDetail} />
              </TabsContent>

              <TabsContent value="resources" className="m-0 p-6">
                <ResourcesTab resources={courseDetail.resources} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - AI Chat */}
        {showAiChat && (
          <AiChatSidebar
            courseId={courseId}
            lessonId={selectedLessonId}
            onClose={() => setShowAiChat(false)}
          />
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        )}

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </div>

      {/* Floating AI Chat Button */}
      {!showAiChat && (
        <Button
          onClick={() => setShowAiChat(true)}
          className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <span className="text-xl">💬</span>
        </Button>
      )}
    </div>
  );
};

export default CourseDetailLayout;
