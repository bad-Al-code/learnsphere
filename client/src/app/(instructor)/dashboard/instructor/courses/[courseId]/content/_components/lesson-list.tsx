'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Pencil, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Lesson } from '@/types/lesson';
import { deleteLesson, reorderLessons, updateLesson } from '../../actions';

interface LessonsListProps {
  initialLessons: Lesson[];
  courseId: string;
  moduleId: string;
}

export function LessonsList({
  initialLessons,
  courseId,
  moduleId,
}: LessonsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticLessons, setOptimisticLessons] = useState(initialLessons);
  const [editLessonId, setEditLessonId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setOptimisticLessons(initialLessons);
  }, [initialLessons]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(optimisticLessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOptimisticLessons(items);

    const bulkUpdateData = items.map((lesson, index) => ({
      id: lesson.id,
      order: index,
    }));

    startTransition(async () => {
      const res = await reorderLessons(courseId, moduleId, bulkUpdateData);
      if (res.error) {
        toast.error('Failed to reorder lessons', { description: res.error });
        setOptimisticLessons(initialLessons);
      } else {
        toast.success('Lessons reordered successfully!');
      }
    });
  };

  const openEditDialog = (lessonId: string, currentTitle: string) => {
    setEditLessonId(lessonId);
    setEditTitle(currentTitle);
  };

  const handleSave = () => {
    if (!editLessonId) return;
    startTransition(async () => {
      const result = await updateLesson(courseId, editLessonId, {
        title: editTitle,
      });

      if (result.error) {
        toast.error('Failed to update lesson', { description: result.error });
      } else {
        toast.success('Lesson updated successfully!');
        setOptimisticLessons((prev) =>
          prev.map((l) =>
            l.id === editLessonId ? { ...l, title: editTitle } : l
          )
        );
        setEditLessonId(null);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteLessonId) return;
    startTransition(async () => {
      const result = await deleteLesson(courseId, deleteLessonId);
      if (result.error) {
        toast.error('Failed to delete lesson', { description: result.error });
      } else {
        toast.success('Lesson deleted successfully');
        setOptimisticLessons((prev) =>
          prev.filter((l) => l.id !== deleteLessonId)
        );
        setDeleteLessonId(null);
      }
    });
  };

  const filteredLessons = optimisticLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lessons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Search for lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`lessons-${moduleId}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {filteredLessons.map((lesson, index) => (
                  <Draggable
                    key={lesson.id}
                    draggableId={lesson.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-card hover:bg-accent flex items-center gap-x-2 rounded-md border p-2 text-sm shadow-sm transition"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab p-1 active:cursor-grabbing"
                        >
                          <Grip className="h-5 w-5" />
                        </div>
                        <Link
                          href={`/dashboard/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                          className="flex-grow font-medium hover:underline"
                        >
                          {lesson.title}
                        </Link>
                        <div className="ml-auto flex items-center gap-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEditDialog(lesson.id, lesson.title)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteLessonId(lesson.id)}
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>

      <Dialog open={!!editLessonId} onOpenChange={() => setEditLessonId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lesson Title</DialogTitle>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isPending}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditLessonId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteLessonId}
        onOpenChange={() => setDeleteLessonId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <p>This will permanently delete the lesson.</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
