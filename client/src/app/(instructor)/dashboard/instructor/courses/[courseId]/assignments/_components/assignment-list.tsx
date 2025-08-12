'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, PlusCircle } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: 'draft' | 'published';
  order: number;
};

interface AssignmentsListProps {
  initialAssignments: Assignment[];
  courseId: string;
}

export function AssignmentsList({
  initialAssignments,
  courseId,
}: AssignmentsListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAssignments, setOptimisticAssignments] =
    useState(initialAssignments);

  useEffect(() => {
    setOptimisticAssignments(initialAssignments);
  }, [initialAssignments]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(optimisticAssignments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOptimisticAssignments(items);

    const bulkUpdateData = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    startTransition(async () => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="assignments">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {optimisticAssignments.map((assignment, index) => (
                <Draggable
                  key={assignment.id}
                  draggableId={assignment.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="flex items-center gap-x-3 rounded-md border p-3"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-muted-foreground text-xs">
                          Due:{' '}
                          {assignment.dueDate
                            ? new Date(assignment.dueDate).toLocaleDateString()
                            : 'N/A'}{' '}
                          | Status: {assignment.status}
                        </p>
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
    </div>
  );
}
