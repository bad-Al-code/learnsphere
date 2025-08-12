'use client';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grip, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  createAssignment,
  deleteAssignment,
  reorderAssignments,
  updateAssignment,
} from '../../actions';

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: 'draft' | 'published';
  order: number;
  moduleId: string;
};

interface AssignmentsListProps {
  initialAssignments: Assignment[];
  courseId: string;
  moduleOptions: { label: string; value: string }[];
}

const assignmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  moduleId: z.string().uuid('Please select a module.'),
  description: z.string().optional(),
});
type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export function AssignmentsList({
  initialAssignments,
  courseId,
  moduleOptions,
}: AssignmentsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticAssignments, setOptimisticAssignments] =
    useState(initialAssignments);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    optimisticAssignments
  );

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      moduleId: '',
      description: '',
    },
  });

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredAssignments(optimisticAssignments);
    } else {
      setFilteredAssignments(
        optimisticAssignments.filter((assignment) =>
          assignment.title.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, optimisticAssignments]);

  useEffect(() => {
    setOptimisticAssignments(initialAssignments);
  }, [initialAssignments]);

  useEffect(() => {
    if (editAssignment) {
      form.reset({
        title: editAssignment.title,
        moduleId: editAssignment.moduleId,
        description: editAssignment.description ?? '',
      });
    } else if (isCreateModalOpen) {
      form.reset({
        title: '',
        moduleId: '',
        description: '',
      });
    }
  }, [editAssignment, isCreateModalOpen, form]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(optimisticAssignments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedList = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setOptimisticAssignments(updatedList);

    startTransition(async () => {
      const moduleId = updatedList[0]?.moduleId ?? '';
      const reorderList = updatedList.map(({ id, order }) => ({ id, order }));
      const result = await reorderAssignments(courseId, moduleId, reorderList);
      if (result.error) {
        toast.error('Failed to reorder assignments', {
          description: result.error,
        });
        setOptimisticAssignments(initialAssignments);
      } else {
        toast.success('Assignments reordered!');
      }
    });
  };

  const handleCreateSubmit = (values: AssignmentFormValues) => {
    startTransition(async () => {
      const result = await createAssignment(courseId, values.moduleId, {
        title: values.title,
        description: values.description,
      });
      if (result.error) {
        toast.error('Failed to create assignment', {
          description: result.error,
        });
      } else {
        toast.success('Assignment created!');
        setIsCreateModalOpen(false);
        router.refresh();
      }
    });
  };

  const handleEditSubmit = (values: {
    title: string;
    moduleId?: string;
    description?: string;
  }) => {
    if (!editAssignment) return;
    startTransition(async () => {
      const result = await updateAssignment(
        courseId,
        editAssignment.id,
        values
      );
      if (result.error) {
        toast.error('Failed to update assignment', {
          description: result.error,
        });
      } else {
        toast.success('Assignment updated!');
        setOptimisticAssignments((prev) =>
          prev.map((a) =>
            a.id === editAssignment.id ? { ...a, ...values } : a
          )
        );
        setEditAssignment(null);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteAssignmentId) return;
    startTransition(async () => {
      const result = await deleteAssignment(courseId, deleteAssignmentId);
      if (result.error) {
        toast.error('Failed to delete assignment', {
          description: result.error,
        });
      } else {
        toast.success('Assignment deleted successfully');
        setOptimisticAssignments((prev) =>
          prev.filter((a) => a.id !== deleteAssignmentId)
        );
        setDeleteAssignmentId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs pl-10"
          />
        </div>

        <Button
          size="sm"
          onClick={() => {
            form.reset();
            setIsCreateModalOpen(true);
          }}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
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
              {filteredAssignments.map((assignment, index) => (
                <Draggable
                  key={assignment.id}
                  draggableId={assignment.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-background flex items-center gap-x-3 rounded-md border p-3"
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
                        {assignment.description && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            form.reset({
                              title: assignment.title,
                              moduleId: assignment.moduleId,
                              description: assignment.description ?? '',
                            });
                            setEditAssignment(assignment);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteAssignmentId(assignment.id)}
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

      <Dialog
        open={isCreateModalOpen || Boolean(editAssignment)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditAssignment(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editAssignment ? 'Edit Assignment' : 'Add New Assignment'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editAssignment ? handleEditSubmit : handleCreateSubmit
              )}
              className="space-y-4"
            >
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!editAssignment && (
                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a module..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
                            {moduleOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditAssignment(null);
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteAssignmentId}
        onOpenChange={(open) => !open && setDeleteAssignmentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
