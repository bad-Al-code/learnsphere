"use client";

import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/session-store";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourse } from "../actions";

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    if (!user) {
      router.push(`/login?from=/courses/${courseId}`);
      return;
    }

    startTransition(async () => {
      const result = await enrollInCourse(courseId);
      if (result?.error) {
        toast.error("Enrollment Failed", {
          description: result.error,
        });
      }
    });
  };

  return (
    <Button
      onClick={handleEnroll}
      size="lg"
      className="w-full font-semibold"
      disabled={isPending}
    >
      {isPending ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
