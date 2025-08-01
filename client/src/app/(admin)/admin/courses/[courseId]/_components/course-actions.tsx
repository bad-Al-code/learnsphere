"use client";

import {
  deleteCourse,
  publishCourse,
  unpublishCourse,
} from "@/app/(admin)/actions";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface CourseActionsProps {
  courseId: string;
  status: "draft" | "published";
}

export function CourseActions({ courseId, status }: CourseActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = (
    action: (id: string) => Promise<{ error?: string }>,
    successMessage: string
  ) => {
    startTransition(async () => {
      const result = await action(courseId);
      if (result.error) {
        toast.error("Action Failed", { description: result.error });
      } else {
        toast.success(successMessage);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      if (result.error) {
        toast.error("Delete Failed", { description: result.error });
      } else {
        toast.success("Course deleted successfully.");
        router.push("/admin/courses");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {status === "draft" ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              // onClick={() => handleAction(publishCourse, "Course published!")}
              disabled={isPending}
            >
              Publish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will publish the course and all of its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleAction(publishCourse, "Course published")}
              >
                Confirm Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isPending} variant="secondary">
              Unpublish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will UnPublish the course and all of its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleAction(unpublishCourse, "Course unpublished")
                }
              >
                Confirm Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isPending}>
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course and all of its content.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
