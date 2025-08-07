"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Module } from "@/types/module";
import { toast } from "sonner";
import { reorderModules } from "../../actions";

interface ModulesListProps {
  initialModules: Module[];
  courseId: string;
}

export function ModulesList({ initialModules, courseId }: ModulesListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [modules, setModules] = useState(initialModules);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    startTransition(async () => {
      const result = await reorderModules(courseId, bulkUpdateData);
      if (result.error) {
        toast.error("Failed to reorder modules", { description: result.error });

        setModules(initialModules);
      } else {
        toast.success("Modules reordered successfully!");
      }
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {modules.map((module, index) => (
              <Draggable key={module.id} draggableId={module.id} index={index}>
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
                      <Button variant="ghost">
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
  );
}
