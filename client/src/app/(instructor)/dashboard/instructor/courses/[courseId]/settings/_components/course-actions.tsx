'use client';

import {
  deleteCourse,
  publishCourse,
  unpublishCourse,
} from '@/app/(admin)/actions';
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
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface CourseActionsProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

export function CourseActions({
  courseId,
  isPublished,
  disabled,
}: CourseActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onPublish = () => {
    startTransition(async () => {
      const action = isPublished ? unpublishCourse : publishCourse;
      const result = await action(courseId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Course ${isPublished ? 'unpublished' : 'published'}!`);
        router.refresh();
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Course deleted.');
        router.push('/dashboard/instructor/courses');
      }
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isPending}
        variant={isPublished ? 'secondary' : 'default'}
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            title="Delete Course"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
