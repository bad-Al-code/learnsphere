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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteCourse, publishCourse, unpublishCourse } from '../../actions';

interface DangerZoneProps {
  courseId: string;
  status: 'draft' | 'published';
  title: string;
}

export function DangerZone({ courseId, status, title }: DangerZoneProps) {
  const router = useRouter();
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleTogglePublish = () => {
    startStatusTransition(async () => {
      const action = status === 'published' ? unpublishCourse : publishCourse;

      const result = await action(courseId);

      if (result.error) {
        toast.error(
          `Failed to ${status === 'published' ? 'unpublish' : 'publish'} course`,
          {
            description: result.error,
          }
        );
      } else {
        toast.success(
          `Course ${status === 'published' ? 'unpublished' : 'published'}!`
        );
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteCourse(courseId);
      if (result?.error) {
        toast.error('Failed to delete course', { description: result.error });
      } else {
        toast.success('Course deleted successfully.');
      }
    });
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          These actions are permanent and cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
          <div>
            <h3 className="font-semibold">
              {status === 'published' ? 'Unpublish Course' : 'Publish Course'}
            </h3>
            <p className="text-muted-foreground text-sm">
              This will make your course {status === 'published' ? 'in' : ''}
              visible to students.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isStatusPending}>
                {status === 'published' ? 'Unpublish' : 'Publish'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will change the visibility of your course for all
                  students.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleTogglePublish}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="border-destructive flex items-center justify-between rounded-lg border border-dashed p-4">
          <div>
            <h3 className="text-destructive font-semibold">Delete Course</h3>
            <p className="text-muted-foreground text-sm">
              Permanently delete this course and all of its content.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeletePending}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. To confirm, please type{' '}
                  <strong className="text-foreground">{title}</strong> in the
                  box below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4 space-y-2">
                <Label htmlFor="delete-confirm">Course Title</Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteConfirmation !== title || isDeletePending}
                >
                  {isDeletePending ? 'Deleting...' : 'Confirm Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
