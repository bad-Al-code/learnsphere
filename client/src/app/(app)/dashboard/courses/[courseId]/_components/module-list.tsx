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
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { AddLessonForm, FormDialog } from './course-modal';

type Lesson = {
  id: string;
  title: string;
  isPublished: boolean;
  lessonType: 'video' | 'text' | 'quiz';
  duration: string;
};

type Module = {
  id: string;
  title: string;
  isPublished: boolean;
  lessonCount: number;
  totalDuration: string;
  lessons: Lesson[];
};

interface ModulesListProps {
  initialModules: Module[];
  courseId: string;
}

const lessonIcons: Record<Lesson['lessonType'], LucideIcon> = {
  video: Video,
  text: FileText,
  quiz: CheckCircle,
};

function LessonItem({
  lesson,
  index,
  courseId,
}: {
  lesson: Lesson;
  index: number;
  courseId: string;
}) {
  const Icon = lessonIcons[lesson.lessonType];
  return (
    <Draggable draggableId={String(lesson.id)} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
              <span className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              <div className="truncate">
                <Link
                  href={`/dashboard/instructor/courses/${courseId}/lessons/${lesson.id}`}
                >
                  <p className="truncate font-medium hover:underline">
                    {lesson.title}
                  </p>
                </Link>
                <p className="text-muted-foreground truncate text-xs">
                  {lesson.lessonType} • {lesson.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={lesson.isPublished ? 'default' : 'secondary'}
                className="hidden sm:inline-flex"
              >
                {lesson.isPublished ? 'Published' : 'Draft'}
              </Badge>
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

function ModuleItem({
  module,
  index,
  courseId,
}: {
  module: Module;
  index: number;
  courseId: string;
}) {
  const { items: lessons, onDragEnd: onLessonsDragEnd } = useDndState(
    module.lessons ?? []
  );

  return (
    <Draggable draggableId={String(module.id)} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps}>
          <CardHeader {...provided.dragHandleProps}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <GripVertical className="text-muted-foreground h-5 w-5" />
                <span className="bg-primary/80 text-primary-foreground flex h-6 w-6 items-center justify-center rounded text-base font-bold">
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
                <Badge variant={module.isPublished ? 'default' : 'secondary'}>
                  {module.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormDialog
                        trigger={
                          <Button variant="outline" size="sm">
                            <Plus className="sm: h-4 w-4" />
                            <span className="hidden sm:inline">Add Lesson</span>
                          </Button>
                        }
                        title="Add New Lesson"
                        description="Create a new lesson in this module"
                        form={<AddLessonForm />}
                        footer={<Button>Create Lesson</Button>}
                      />
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
                        key={String(lesson.id) || `lesson-${lessonIndex}`}
                        lesson={lesson}
                        index={lessonIndex}
                        courseId={courseId}
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

export function ModulesList({ initialModules, courseId }: ModulesListProps) {
  const { items: modules, onDragEnd: onModulesDragEnd } =
    useDndState(initialModules);

  return (
    <DragDropContext onDragEnd={onModulesDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {modules.map((module, index) => (
              <ModuleItem
                key={String(module.id) || `module-${index}`}
                module={module}
                index={index}
                courseId={courseId}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function LessonItemSkeleton() {
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

export function ModuleItemSkeleton() {
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
