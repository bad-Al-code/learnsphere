'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ModuleUpdateSchemaValues } from '@/lib/schemas/module';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  LucideIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  deleteLesson,
  deleteModule,
  reorderLessons,
  reorderModules,
  updateLesson,
  updateModule,
} from '../../actions';
import { AddLessonForm, AddModuleForm } from './course-modal';

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
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  lesson: Lesson;
  index: number;
  courseId: string;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const Icon = lessonIcons[lesson.lessonType];
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
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={onTogglePublish}>
                    {lesson.isPublished ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive hover:!text-destructive focus:!text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
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
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  module: Module;
  index: number;
  courseId: string;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const [lessons, setLessons] = useState(module.lessons ?? []);
  const [isLessonPending, startLessonTransition] = useTransition();
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);

  const handleLessonCreated = (newLesson: Lesson) => {
    setLessons((prevLessons) => [...prevLessons, newLesson]);
  };

  const onLessonsDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLessons(items);
    const bulkUpdate = items.map((l, i) => ({ id: l.id, order: i }));

    startLessonTransition(() => {
      toast.promise(reorderLessons(courseId, module.id, bulkUpdate), {
        loading: 'Reordering lessons...',
        success: 'Lessons reordered!',
        error: (err) => {
          setLessons(module.lessons);
          return err.message || 'Failed to reorder lessons.';
        },
      });
    });
  };

  const handleEditLessonClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setNewLessonTitle(lesson.title);
  };

  const handleSaveLessonEdit = () => {
    if (
      !editingLesson ||
      !newLessonTitle.trim() ||
      newLessonTitle === editingLesson.title
    ) {
      setEditingLesson(null);
      return;
    }
    const previousLessons = lessons;
    setLessons((prev) =>
      prev.map((l) =>
        l.id === editingLesson.id ? { ...l, title: newLessonTitle } : l
      )
    );
    setEditingLesson(null);

    startLessonTransition(() => {
      toast.promise(
        updateLesson(courseId, editingLesson.id, { title: newLessonTitle }),
        {
          loading: 'Updating lesson...',
          success: 'Lesson updated!',
          error: (err) => {
            setLessons(previousLessons);
            return err.message || 'Failed to update lesson.';
          },
        }
      );
    });
  };

  const handleDeleteLessonClick = (lesson: Lesson) => {
    setDeletingLesson(lesson);
  };

  const handleConfirmLessonDelete = () => {
    if (!deletingLesson) return;
    const previousLessons = lessons;
    setLessons((prev) => prev.filter((l) => l.id !== deletingLesson.id));
    setDeletingLesson(null);

    startLessonTransition(() => {
      toast.promise(deleteLesson(courseId, deletingLesson.id), {
        loading: 'Deleting lesson...',
        success: 'Lesson deleted!',
        error: (err) => {
          setLessons(previousLessons);
          return err.message || 'Failed to delete lesson.';
        },
      });
    });
  };

  const handleToggleLessonPublish = (lessonToToggle: Lesson) => {
    const previousLessons = lessons;

    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonToToggle.id ? { ...l, isPublished: !l.isPublished } : l
      )
    );

    startLessonTransition(() => {
      toast.promise(
        updateLesson(courseId, lessonToToggle.id, {
          isPublished: !lessonToToggle.isPublished,
        }),
        {
          loading: 'Updating status...',
          success: 'Lesson status updated!',
          error: (err) => {
            setLessons(previousLessons);
            return err.message || 'Failed to update status.';
          },
        }
      );
    });
  };

  return (
    <>
      <Draggable draggableId={module.id} index={index}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddLessonOpen(true)}
                        >
                          <Plus className="sm: h-4 w-4" />
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
                      <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                        Edit Module
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={onTogglePublish}>
                        {module.isPublished ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Copy className="h-4 w-4" />
                        Duplicate (WIP)
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive hover:!text-destructive focus:!text-destructive"
                        onClick={onDelete}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
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
                          courseId={courseId}
                          onEdit={() => handleEditLessonClick(lesson)}
                          onDelete={() => handleDeleteLessonClick(lesson)}
                          onTogglePublish={() =>
                            handleToggleLessonPublish(lesson)
                          }
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

      <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson in "{module.title}"
            </DialogDescription>
          </DialogHeader>
          <AddLessonForm
            courseId={courseId}
            moduleId={module.id}
            onLessonCreated={handleLessonCreated}
            setDialogOpen={setIsAddLessonOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingLesson}
        onOpenChange={() => setEditingLesson(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lesson Title</DialogTitle>
          </DialogHeader>
          <Input
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            disabled={isLessonPending}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingLesson(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLessonEdit} disabled={isLessonPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingLesson}
        onOpenChange={() => setDeletingLesson(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lesson "{deletingLesson?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLessonDelete}
              disabled={isLessonPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ModulesList({ initialModules, courseId }: ModulesListProps) {
  const [modules, setModules] = useState(initialModules);
  const [isPending, startTransition] = useTransition();

  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);
  const [newModulePublished, setNewModulePublished] = useState(false);

  useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModules(items);

    const bulkUpdateData = items.map((module, index) => ({
      id: module.id,
      order: index,
    }));

    startTransition(() => {
      toast.promise(reorderModules(courseId, bulkUpdateData), {
        loading: 'Saving new order...',
        success: 'Modules reordered successfully!',
        error: (err) => {
          setModules(initialModules);

          return err.message || 'Failed to save new order.';
        },
      });
    });
  };

  const handleEditClick = (module: Module) => {
    setEditingModule(module);
    setNewModuleTitle(module.title);
    setNewModulePublished(module.isPublished);
  };

  const handleSaveModuleEdit = () => {
    if (!editingModule) return;

    const updatePayload: ModuleUpdateSchemaValues = {};
    if (newModuleTitle.trim() && newModuleTitle !== editingModule.title) {
      updatePayload.title = newModuleTitle;
    }
    if (newModulePublished !== editingModule.isPublished) {
      updatePayload.isPublished = newModulePublished;
    }

    if (Object.keys(updatePayload).length === 0) {
      setEditingModule(null);
      return;
    }

    const previousModules = modules;
    setModules((prev) =>
      prev.map((m) =>
        m.id === editingModule.id ? { ...m, title: newModuleTitle } : m
      )
    );
    setEditingModule(null);

    startTransition(() => {
      toast.promise(
        updateModule(courseId, editingModule.id, { title: newModuleTitle }),
        {
          loading: 'Updating module...',
          success: 'Module updated!',
          error: (err) => {
            setModules(previousModules);
            return err.message || 'Failed to update.';
          },
        }
      );
    });
  };

  const handleDeleteClick = (module: Module) => {
    setDeletingModule(module);
  };

  const handleConfirmDelete = () => {
    if (!deletingModule) return;

    const previousModules = modules;
    setModules((prev) => prev.filter((m) => m.id !== deletingModule.id));
    setDeletingModule(null);

    startTransition(() => {
      toast.promise(deleteModule(courseId, deletingModule.id), {
        loading: 'Deleting module...',
        success: 'Module deleted!',
        error: (err) => {
          setModules(previousModules);
          return err.message || 'Failed to delete.';
        },
      });
    });
  };

  const handleToggleModulePublish = (moduleToToggle: Module) => {
    const previousModules = modules;

    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleToToggle.id ? { ...m, isPublished: !m.isPublished } : m
      )
    );

    startTransition(() => {
      toast.promise(
        updateModule(courseId, moduleToToggle.id, {
          isPublished: !moduleToToggle.isPublished,
        }),
        {
          loading: 'Updating status...',
          success: 'Module status updated!',
          error: (err) => {
            setModules(previousModules);
            return err.message || 'Failed to update status.';
          },
        }
      );
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {modules.map((module, index) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  index={index}
                  courseId={courseId}
                  onEdit={() => handleEditClick(module)}
                  onDelete={() => handleDeleteClick(module)}
                  onTogglePublish={() => handleToggleModulePublish(module)}
                />
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog
        open={!!editingModule}
        onOpenChange={() => setEditingModule(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-module-title">Module Title</Label>

              <Input
                id="edit-module-title"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Publish</Label>

                <FormDescription>
                  Make this module visible to students.
                </FormDescription>
              </div>
              <Switch
                checked={newModulePublished}
                onCheckedChange={setNewModulePublished}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingModule(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModuleEdit} disabled={isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingModule}
        onOpenChange={() => setDeletingModule(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the module "{deletingModule?.title}"
              and all of its lessons. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ContentTabHeader({ courseId }: { courseId: string }) {
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
          <AddModuleForm courseId={courseId} />

          <Button>
            <Upload className="h-4 w-4" /> Upload Content
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ContentTabHeaderSkeleton() {
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
