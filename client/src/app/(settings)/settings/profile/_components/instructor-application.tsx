"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { applyForInstructor } from "@/app/(settings)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InstructorApplicationProps {
  userStatus: "active" | "pending_instructor_review" | "suspended" | string;
  userRole: "student" | "instructor" | "admin";
}

export function InstructorApplication({
  userStatus,
  userRole,
}: InstructorApplicationProps) {
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    startTransition(async () => {
      const result = await applyForInstructor();
      if (result.error) {
        toast.error(result.error || "Application Failed");
      } else {
        toast.success(result.message || "Application Submitted!");
      }
    });
  };

  if (userRole === "instructor" || userRole === "admin") {
    return null;
  }

  return (
    <Card className="md:mt-4">
      <CardHeader>
        <CardTitle>Become an Instructor</CardTitle>
        <CardDescription>
          Share your knowledge with the LearnSphere community by becoming an
          instructor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userStatus === "pending_instructor_review" ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="font-medium text-yellow-800">
              Your application is under review.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              We'll notify you once a decision has been made. Thank you for your
              patience.
            </p>
          </div>
        ) : (
          <div className="flex flex-col  items-center justify-between p-4 border rounded-lg">
            <p className="text-sm mb-4">Ready to start teaching? Apply now.</p>
            <Button onClick={handleApply} disabled={isPending}>
              {isPending ? "Submitting..." : "Apply Now"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
