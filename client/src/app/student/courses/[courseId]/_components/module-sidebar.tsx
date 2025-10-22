'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  Headphones,
  Lock,
  Play,
} from 'lucide-react';
import { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'text' | 'quiz' | 'assignment' | 'resource';
  duration?: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const MOCK_MODULES: Module[] = [
  {
    id: 'module-1',
    title: 'Getting Started with React',
    description: 'Learn the basics of React',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to React',
        type: 'video',
        duration: '12:45',
        completed: true,
        locked: false,
      },
      {
        id: 'lesson-2',
        title: 'JSX Basics',
        type: 'text',
        completed: true,
        locked: false,
      },
      {
        id: 'lesson-3',
        title: 'Components & Props',
        type: 'video',
        duration: '18:30',
        completed: false,
        locked: false,
      },
      {
        id: 'lesson-4',
        title: 'Quiz: React Fundamentals',
        type: 'quiz',
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'State & Hooks',
    description: 'Master React state management',
    lessons: [
      {
        id: 'lesson-5',
        title: 'Understanding State',
        type: 'video',
        duration: '15:20',
        completed: false,
        locked: false,
      },
      {
        id: 'lesson-6',
        title: 'useState Hook',
        type: 'audio',
        duration: '8:15',
        completed: false,
        locked: false,
      },
      {
        id: 'lesson-7',
        title: 'useEffect Hook',
        type: 'text',
        completed: false,
        locked: false,
      },
      {
        id: 'lesson-8',
        title: 'Assignment: Build a Counter',
        type: 'assignment',
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Advanced Patterns',
    description: 'Learn advanced React patterns',
    lessons: [
      {
        id: 'lesson-9',
        title: 'Custom Hooks',
        type: 'video',
        duration: '22:10',
        completed: false,
        locked: true,
      },
      {
        id: 'lesson-10',
        title: 'Context API',
        type: 'text',
        completed: false,
        locked: true,
      },
      {
        id: 'lesson-11',
        title: 'Resources & Best Practices',
        type: 'resource',
        completed: false,
        locked: true,
      },
    ],
  },
];

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="h-4 w-4" />;
    case 'audio':
      return <Headphones className="h-4 w-4" />;
    case 'text':
      return <FileText className="h-4 w-4" />;
    case 'quiz':
      return <BookOpen className="h-4 w-4" />;
    case 'assignment':
      return <BookOpen className="h-4 w-4" />;
    case 'resource':
      return <FileText className="h-4 w-4" />;
    default:
      return <Play className="h-4 w-4" />;
  }
};

interface ModulesSidebarProps {
  selectedLesson: string;
  onSelectLesson: (lessonId: string) => void;
}

export function ModulesSidebar({
  selectedLesson,
  onSelectLesson,
}: ModulesSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([
    'module-1',
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const filteredModules = MOCK_MODULES.map((module) => ({
    ...module,
    lessons: module.lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((module) => module.lessons.length > 0);

  return (
    <div className="border-border bg-card flex h-full w-80 flex-col border-r">
      <div className="border-border border-b p-4">
        <h2 className="mb-3 text-lg font-semibold">Course Content</h2>
        <Input
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filteredModules.map((module) => (
          <div key={module.id} className="border-border border-b">
            <button
              onClick={() => toggleModule(module.id)}
              className="hover:bg-accent flex w-full items-center justify-between px-4 py-3 transition-colors"
            >
              <div className="flex flex-1 items-center gap-2 text-left">
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    !expandedModules.includes(module.id) && '-rotate-90'
                  )}
                />
                <div>
                  <p className="text-sm font-medium">{module.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {module.lessons.length} lessons
                  </p>
                </div>
              </div>
            </button>

            {expandedModules.includes(module.id) && (
              <div className="bg-muted/30 py-2">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={cn(
                      'flex w-full items-center gap-3 px-6 py-2 text-left text-sm transition-colors',
                      selectedLesson === lesson.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground',
                      lesson.locked && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                      ) : lesson.locked ? (
                        <Lock className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        getLessonIcon(lesson.type)
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    {lesson.duration && (
                      <span className="text-muted-foreground flex-shrink-0 text-xs">
                        {lesson.duration}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-border bg-muted/30 border-t p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Course Progress</span>
          <span className="text-sm font-semibold">45%</span>
        </div>
        <div className="bg-muted h-2 w-full rounded-full">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: '45%' }}
          />
        </div>
      </div>
    </div>
  );
}
