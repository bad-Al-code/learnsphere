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
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  UpdateAssignmentFormValues,
  updateAssignmentSchema,
} from '@/lib/schemas/assignment';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { deleteAssignment, updateAssignment } from '../../actions';

type Assignment = {
  id: string;
  title: string;
  status: 'draft' | 'published';
  dueDate: string | Date | null;
  description: string | null;
  moduleId: string;
};

interface AssignmentsListProps {
  initialAssignments: Assignment[];
  courseId: string;
  moduleOptions: { label: string; value: string }[];
}

export function AssignmentsList({
  initialAssignments,
  courseId,
  moduleOptions,
}: AssignmentsListProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [isPending, startTransition] = useTransition();
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

  const form = useForm<UpdateAssignmentFormValues>({
    resolver: zodResolver(updateAssignmentSchema),
  });

  const handleEditClick = (assignment: Assignment) => {
    form.reset({
      title: assignment.title,
      description: assignment.description || '',
      dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
      status: assignment.status,
    });

    setEditingAssignment(assignment);
  };

  const handleEditSubmit = (values: UpdateAssignmentFormValues) => {
    if (!editingAssignment) return;

    const previousAssignments = assignments;
    setAssignments((prev) =>
      prev.map((a) => (a.id === editingAssignment.id ? { ...a, ...values } : a))
    );
    setEditingAssignment(null);

    startTransition(() => {
      toast.promise(updateAssignment(courseId, editingAssignment.id, values), {
        loading: 'Updating assignment...',
        success: 'Assignment updated!',
        error: (err) => {
          setAssignments(previousAssignments);
          return err.message || 'Update failed.';
        },
      });
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingAssignment) return;

    const previousAssignments = assignments;
    setAssignments((prev) =>
      prev.filter((a) => a.id !== deletingAssignment.id)
    );
    setDeletingAssignment(null);

    startTransition(() => {
      toast.promise(deleteAssignment(courseId, deletingAssignment.id), {
        loading: 'Deleting assignment...',
        success: 'Assignment deleted!',

        error: (err) => {
          setAssignments(previousAssignments);
          return err.message || 'Delete failed.';
        },
      });
    });
  };

  const handleTogglePublish = (assignmentToToggle: Assignment) => {
    const previousAssignments = assignments;
    const newStatus =
      assignmentToToggle.status === 'published' ? 'draft' : 'published';

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentToToggle.id ? { ...a, status: newStatus } : a
      )
    );

    startTransition(() => {
      toast.promise(
        updateAssignment(courseId, assignmentToToggle.id, {
          status: newStatus,
        }),
        {
          loading: 'Updating status...',
          success: 'Assignment status updated!',
          error: (err) => {
            setAssignments(previousAssignments);
            return err.message || 'Failed to update status.';
          },
        }
      );
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {initialAssignments.length > 0 ? (
              initialAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        assignment.status === 'published'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {assignment.dueDate
                      ? format(new Date(assignment.dueDate), 'PPP')
                      : 'N/A'}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(assignment)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(assignment)}
                          className="flex items-center gap-2"
                        >
                          {assignment.status === 'published' ? (
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
                          onClick={() => setDeletingAssignment(assignment)}
                        >
                          <Trash2 className="text-destructive h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No assignments found for this course.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editingAssignment}
        onOpenChange={() => setEditingAssignment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingAssignment(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingAssignment}
        onOpenChange={() => setDeletingAssignment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingAssignment?.title}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
