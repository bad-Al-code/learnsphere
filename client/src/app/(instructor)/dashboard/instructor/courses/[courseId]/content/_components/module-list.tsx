"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Module } from "@/types/module";
import { toast } from "sonner";
import { reorderModules, updateModule } from "../../actions";

interface ModulesListProps {
  modules: Module[];
  courseId: string;
}

export function ModulesList({ modules, courseId }: ModulesListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticModules, setOptimisticModules] = useState(modules);

  const [editModuleId, setEditModuleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    setOptimisticModules(modules);
  }, [modules]);

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
        toast.error("Failed to reorder modules", { description: result.error });
        setOptimisticModules(modules);
      } else {
        toast.success("Modules reordered successfully!");
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
      const result = await updateModule(editModuleId, { title: editTitle });

      if (result.error) {
        toast.error("Failed to update module", { description: result.error });
      } else {
        toast.success("Module updated successfully!");
        setOptimisticModules((prev) =>
          prev.map((m) =>
            m.id === editModuleId ? { ...m, title: editTitle } : m
          )
        );
        setEditModuleId(null);
      }
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {optimisticModules.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="flex items-center gap-x-2 p-1 border rounded-md text-sm cursor-grab active:cursor-grabbing"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="p-2 border-r rounded-l-md transition">
                        <Grip className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{module.title}</span>
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            openEditDialog(module.id, module.title)
                          }
                        >
                          <Pencil className="h-4 w-4" />
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

      <Dialog open={!!editModuleId} onOpenChange={() => setEditModuleId(null)}>
        <DialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader>
            <DialogTitle>Edit Module Title</DialogTitle>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="New module title"
            disabled={isPending}
          />
          <Button onClick={handleSave} disabled={isPending}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
