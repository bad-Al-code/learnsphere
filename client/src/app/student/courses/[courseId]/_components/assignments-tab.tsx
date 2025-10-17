'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
import { Calendar, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import type { Assignment } from '../schema/course-detail.schema';

interface AssignmentsTabProps {
  moduleId: string | null;
  assignments: Assignment[];
}

export function AssignmentsTab({ moduleId, assignments }: AssignmentsTabProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const filteredAssignments = moduleId
    ? assignments.filter((a) => a.moduleId === moduleId)
    : assignments;

  if (filteredAssignments.length === 0) {
    return (
      <div className="border-border flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">No assignments for this module</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAssignments.map((assignment) => (
        <Card key={assignment.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription className="mt-1">
                  {assignment.description}
                </CardDescription>
              </div>
              <Badge
                variant={
                  assignment.status === 'submitted' ? 'default' : 'secondary'
                }
                className="ml-2"
              >
                {assignment.status === 'submitted' ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Submitted
                  </>
                ) : (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Points: {assignment.points}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setSelectedAssignment(assignment);
                setShowSubmitDialog(true);
              }}
              className="w-full"
              variant={
                assignment.status === 'submitted' ? 'outline' : 'default'
              }
            >
              {assignment.status === 'submitted'
                ? 'View Submission'
                : 'Submit Assignment'}
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>{selectedAssignment?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedAssignment?.status === 'submitted'
              ? 'You have already submitted this assignment.'
              : `Submit your work for "${selectedAssignment?.title}"?`}
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowSubmitDialog(false);
                // Show success toast
              }}
            >
              {selectedAssignment?.status === 'submitted' ? 'Close' : 'Submit'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
