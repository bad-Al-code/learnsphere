"use client";

import {
  approveInstructor,
  declineInstructor,
  reinstateUser,
  suspendUser,
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
import { useTransition } from "react";
import { toast } from "sonner";

interface UserActionsProps {
  user: {
    userId: string;
    status: string;
    role: string | null;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (
    action: (
      userId: string
    ) => Promise<{ error?: string; success?: boolean; message?: string }>
  ) => {
    startTransition(async () => {
      const result = await action(user.userId);
      if (result.error) {
        toast.error(result.error || "Action Failed");
      } else {
        toast.success("User status updated successfully!");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* --- APPROVE/DECLINE FLOW --- */}
      {user.status === "pending_instructor_review" && (
        <>
          <Button
            onClick={() => handleAction(approveInstructor)}
            disabled={isPending}
            variant="default"
          >
            Approve Instructor
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                Decline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will decline the user's instructor application and set
                  their status back to active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction(declineInstructor)}
                >
                  Confirm Decline
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* --- Suspend User Button --- */}
      {user.status !== "suspended" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              Suspend User
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will suspend the user's account, preventing them from
                logging in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(suspendUser)}>
                Confirm Suspend
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* --- Reinstate User Button --- */}
      {user.status === "suspended" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isPending} variant="secondary">
              Reinstate User
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reinstate the user's account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(reinstateUser)}>
                Confirm Reinstate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
