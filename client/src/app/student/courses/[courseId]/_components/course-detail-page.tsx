'use client';

import { useState } from 'react';
import { AIChatSidebar } from './ai-chat-sidebar';
import { LessonViewer } from './lesson-viewer';
import { ModulesSidebar } from './module-sidebar';

export function CourseDetailPage() {
  const [selectedLesson, setSelectedLesson] = useState<string>('lesson-1');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAIChat, setShowAIChat] = useState(true);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-background text-foreground min-h-screen">
        {/* <CourseHeader onThemeToggle={() => setIsDarkMode(!isDarkMode)} /> */}

        <div className="flex h-[calc(100vh-64px)]">
          {/* Modules Sidebar */}
          <ModulesSidebar
            selectedLesson={selectedLesson}
            onSelectLesson={setSelectedLesson}
          />

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <LessonViewer lessonId={selectedLesson} />
            </div>

            {/* AI Chat Sidebar */}
            {showAIChat && (
              <div className="border-border bg-card w-96 border-l">
                <AIChatSidebar
                  lessonId={selectedLesson}
                  onClose={() => setShowAIChat(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
