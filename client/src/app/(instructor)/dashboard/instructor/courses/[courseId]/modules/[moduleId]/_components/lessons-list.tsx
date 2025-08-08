"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Lesson } from "@/types/lesson";
import { deleteLesson, reorderLessons, updateLesson } from "../../../actions";

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
  const [isPending, startTransition] = useTransition();
  const [optimisticLessons, setOptimisticLessons] = useState(initialLessons);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [isDeleteLesson, setIsDeleteLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      toast.promise(reorderLessons(courseId, moduleId, bulkUpdateData), {
        loading: "Reordering lessons...",
        success: "Lessons reordered!",
        error: (err) => {
          setOptimisticLessons(initialLessons);

          return err.message || "Failed to reorder.";
        },
      });
    });
  };

  const handleSave = (newTitle: string) => {
    if (!editLesson) return;

    startTransition(async () => {
      const result = await updateLesson(courseId, editLesson.id, {
        title: newTitle,
      });
      if (result.error) {
        toast.error("Failed to update lesson", { description: result.error });
      } else {
        toast.success("Lesson updated successfully!");

        setOptimisticLessons((prev) =>
          prev.map((l) =>
            l.id === editLesson.id ? { ...l, title: newTitle } : l
          )
        );

        setEditLesson(null);
      }
    });
  };

  const handleDelete = () => {
    if (!isDeleteLesson) return;

    startTransition(async () => {
      const result = await deleteLesson(courseId, isDeleteLesson.id);
      if (result.error) {
        toast.error("Failed to delete lesson", { description: result.error });
      } else {
        toast.success("Lesson deleted successfully");
        setOptimisticLessons((prev) =>
          prev.filter((l) => l.id !== isDeleteLesson.id)
        );
        setIsDeleteLesson(null);
      }
    });
  };

  const filteredLessons = optimisticLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
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
                      className="flex items-center gap-x-2 p-2 border rounded-md text-sm bg-background"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="p-1 cursor-grab active:cursor-grabbing"
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      <Link
                        href={`/dashboard/instructor/courses/${courseId}/lessons/${lesson.id}`}
                        className="font-medium flex-grow hover:underline"
                      >
                        {lesson.title}
                      </Link>
                      <div className="ml-auto pr-1 flex items-center gap-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditLesson(lesson)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsDeleteLesson(lesson)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Edit Dialog */}
      <Dialog open={!!editLesson} onOpenChange={() => setEditLesson(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lesson Title</DialogTitle>
          </DialogHeader>
          <Input
            defaultValue={editLesson?.title}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave(e.currentTarget.value);
            }}
            placeholder="New lesson title"
            disabled={isPending}
            id="edit-lesson-title-input"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditLesson(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleSave(
                  (
                    document.getElementById(
                      "edit-lesson-title-input"
                    ) as HTMLInputElement
                  )?.value || ""
                )
              }
              disabled={isPending}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!isDeleteLesson}
        onOpenChange={() => setIsDeleteLesson(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this lesson?
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{isDeleteLesson?.title}" will be permanently deleted. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
