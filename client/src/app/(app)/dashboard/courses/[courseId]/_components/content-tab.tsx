'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDndState } from '@/hooks/use-dnd-state';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  CheckCircle,
  FileText,
  GripVertical,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Upload,
  Video,
} from 'lucide-react';
import { AddModuleForm, FormDialog } from './course-modal';

type LessonType = 'video' | 'text' | 'quiz';

interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  duration: string;
}

interface Module {
  id: string;
  title: string;
  lessonCount: number;
  totalDuration: string;
  lessons: Lesson[];
}

interface ContentTabProps {
  initialModules?: Module[];
}

const placeholderModules: Module[] = [
  {
    id: 'module-1',
    title: 'Introduction to Data Science',
    lessonCount: 3,
    totalDuration: '2h 30m',
    lessons: [
      {
        id: 'lesson-1-1',
        type: 'video',
        title: 'What is Data Science?',
        duration: '15 min',
      },
      {
        id: 'lesson-1-2',
        type: 'text',
        title: 'Data Science Applications',
        duration: '10 min',
      },
      {
        id: 'lesson-1-3',
        type: 'quiz',
        title: 'Knowledge Check',
        duration: '5 min',
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Data Collection and Cleaning',
    lessonCount: 3,
    totalDuration: '1h 45m',
    lessons: [
      {
        id: 'lesson-2-1',
        type: 'video',
        title: 'Data Sources',
        duration: '20 min',
      },
      {
        id: 'lesson-2-2',
        type: 'text',
        title: 'Data Cleaning Techniques',
        duration: '25 min',
      },
      {
        id: 'lesson-2-3',
        type: 'quiz',
        title: 'Data Validation Quiz',
        duration: '10 min',
      },
    ],
  },
];

const lessonIcons: Record<LessonType, LucideIcon> = {
  video: Video,
  text: FileText,
  quiz: CheckCircle,
};

export function ContentTab({
  initialModules = placeholderModules,
}: ContentTabProps) {
  const { items: modules, onDragEnd: onModulesDragEnd } =
    useDndState(initialModules);

  return (
    <div className="space-y-6">
      <ContentTabHeader />
      <Card>
        <CardHeader>
          <CardTitle>Introduction to Data Science - Course Structure</CardTitle>
          <CardDescription>
            Organize your course content into modules and lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onModulesDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {modules.map((module, index) => (
                    <ModuleItem key={module.id} module={module} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
}

function LessonItem({ lesson, index }: { lesson: Lesson; index: number }) {
  const Icon = lessonIcons[lesson.type];
  return (
    <Draggable draggableId={lesson.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div {...provided.dragHandleProps}>
                <GripVertical className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
              <span className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              <div className="truncate">
                <p className="truncate font-medium">{lesson.title}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {lesson.type} • {lesson.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="hidden sm:inline-flex">Published</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      )}
    </Draggable>
  );
}

function ModuleItem({ module, index }: { module: Module; index: number }) {
  const { items: lessons, onDragEnd: onLessonsDragEnd } = useDndState(
    module.lessons
  );

  return (
    <Draggable draggableId={module.id} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps}>
          <CardHeader {...provided.dragHandleProps}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <GripVertical className="text-muted-foreground h-5 w-5" />
                <span className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-base font-bold">
                  {index + 1}
                </span>
                <div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>
                    {module.lessonCount} lessons • {module.totalDuration}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Published</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Lesson</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Lesson</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Module</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-12">
            <DragDropContext onDragEnd={onLessonsDragEnd}>
              <Droppable droppableId={`lessons-${module.id}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {lessons.map((lesson, lessonIndex) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        index={lessonIndex}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

function ContentTabHeader() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Course Content</h3>
          <p className="text-muted-foreground">
            Manage modules, lessons, and course materials
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <FormDialog
            trigger={
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            }
            title="Add New Module"
            description="Create a new module for your course content."
            form={<AddModuleForm />}
            footer={<Button>Create Module</Button>}
          />
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Content
          </Button>
        </div>
      </div>
    </div>
  );
}

function LessonItemSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-4" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-6 w-20 rounded-full sm:inline-flex" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
}

function ModuleItemSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 sm:w-56" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-9 w-10 sm:w-28" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pl-12">
        <LessonItemSkeleton />
        <LessonItemSkeleton />
      </CardContent>
    </Card>
  );
}

function ContentTabHeaderSkeleton() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}

export function ContentTabSkeleton() {
  return (
    <div className="space-y-6">
      <ContentTabHeaderSkeleton />
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ModuleItemSkeleton />
          <ModuleItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
