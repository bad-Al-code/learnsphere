'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateAssignment } from '../../actions';

type Assignment = {
  id: string;
  title: string;
  status: 'draft' | 'published';
  dueDate: string | null;
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

  useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

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
                    ? new Date(assignment.dueDate).toLocaleDateString()
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
                      <DropdownMenuItem>
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
                        // onClick={onDelete}
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
  );
}
