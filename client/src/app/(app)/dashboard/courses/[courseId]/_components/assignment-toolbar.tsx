'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { CreateAssignmentForm } from './course-modal';

interface AssignmentToolbarProps {
  moduleOptions: { label: string; value: string }[];
  courseId: string;
}

export function AssignmentToolbar({
  moduleOptions,
  courseId,
}: AssignmentToolbarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const onCreationSuccess = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Set up a new assignment for your students.
            </DialogDescription>
          </DialogHeader>
          <CreateAssignmentForm
            courseId={courseId}
            moduleOptions={moduleOptions}
            setDialogOpen={setIsCreateModalOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
