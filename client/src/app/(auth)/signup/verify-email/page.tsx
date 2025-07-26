"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { resendVerificationEmail } from "../../actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [cooldown, setCooldown] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const onResend = () => {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email not found. Please try signing up again.");
      return;
    }

    startTransition(async () => {
      const result = await resendVerificationEmail({ email });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("A new verification email has been sent.");

        setCooldown(60);
      }
    });
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="mt-4 text-2xl">Invalid Page</CardTitle>
            <CardDescription>
              No email was provided. Please sign up again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please click the link in the email to complete your registration.
          </p>
        </CardContent>
        <CardFooter className="flex-col items-center justify-center space-y-4">
          <Button
            onClick={onResend}
            disabled={isPending || cooldown > 0}
            variant="secondary"
            className="w-full"
          >
            {isPending
              ? "Sending..."
              : cooldown > 0
              ? `Resend on ${cooldown}s`
              : "Resend Verification Email"}
          </Button>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm font-medium text-green-600">{success}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
