'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Module } from '@/types/module';
import { deleteModule, reorderModules, updateModule } from '../../actions';
import { LessonsList } from './lesson-list';

interface ModulesListProps {
  initialModules: Module[];
  courseId: string;
}

export function ModulesList({ initialModules, courseId }: ModulesListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticModules, setOptimisticModules] = useState(initialModules);
  const [editModuleId, setEditModuleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setOptimisticModules(initialModules);
  }, [initialModules]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(optimisticModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOptimisticModules(items);

    const bulkUpdateData = items.map((module, index) => ({
      id: module.id,
      order: index,
    }));

    startTransition(async () => {
      const result = await reorderModules(courseId, bulkUpdateData);
      if (result.error) {
        toast.error('Failed to reorder modules', { description: result.error });
        setOptimisticModules(initialModules);
      } else {
        toast.success('Modules reordered successfully!');
      }
    });
  };

  const openEditDialog = (moduleId: string, currentTitle: string) => {
    setEditModuleId(moduleId);
    setEditTitle(currentTitle);
  };

  const handleSave = () => {
    if (!editModuleId) return;
    startTransition(async () => {
      const result = await updateModule(courseId, editModuleId, {
        title: editTitle,
      });
      if (result.error) {
        toast.error('Failed to update module', { description: result.error });
      } else {
        toast.success('Module updated successfully!');
        setOptimisticModules((prev) =>
          prev.map((m) =>
            m.id === editModuleId ? { ...m, title: editTitle } : m
          )
        );
        setEditModuleId(null);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteModuleId) return;
    startTransition(async () => {
      const result = await deleteModule(courseId, deleteModuleId);
      if (result.error) {
        toast.error('Failed to delete module', { description: result.error });
      } else {
        toast.success('Module deleted successfully');
        setOptimisticModules((prev) =>
          prev.filter((m) => m.id !== deleteModuleId)
        );
        setDeleteModuleId(null);
      }
    });
  };

  const filteredModules = optimisticModules.filter((module) =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input
          placeholder="Search for modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Accordion type="multiple">
                {filteredModules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(provided) => (
                      <AccordionItem
                        value={module.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4 overflow-hidden rounded-md border"
                      >
                        <div className="bg-muted/40 flex items-center justify-between">
                          <div className="flex flex-1 items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab p-2 active:cursor-grabbing"
                            >
                              <Grip className="h-5 w-5" />
                            </div>

                            <AccordionTrigger className="flex-1 px-2 hover:no-underline">
                              <Link
                                href={`/dashboard/instructor/courses/${courseId}/modules/${module.id}`}
                                className="block w-full text-left hover:underline"
                              >
                                <div>
                                  <span className="text-sm font-medium">
                                    {module.title}
                                  </span>
                                </div>
                              </Link>
                            </AccordionTrigger>
                          </div>

                          <div className="flex items-center gap-x-1 pr-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(module.id, module.title);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModuleId(module.id);
                              }}
                            >
                              <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <AccordionContent className="bg-background border-border border-t p-4">
                          <LessonsList
                            initialLessons={module.lessons}
                            courseId={courseId}
                            moduleId={module.id}
                          />
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mt-4"
                          >
                            <Link
                              href={`/dashboard/instructor/courses/${courseId}/modules/${module.id}/lessons/create`}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add a lesson
                            </Link>
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Draggable>
                ))}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={!!editModuleId} onOpenChange={() => setEditModuleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module Title</DialogTitle>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditModuleId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteModuleId}
        onOpenChange={() => setDeleteModuleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <p>This will permanently delete the module and all of its lessons.</p>
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
