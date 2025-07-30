"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyResetCode, verifyResetToken } from "../actions";

const otpSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingCard message="Loading..." />}>
      <ResetPasswordFlow />
    </Suspense>
  );
}

function ResetPasswordFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (token && email) {
    return <VerifyResetTokenComponent token={token} email={email} />;
  }

  if (email) {
    return <EnterCodeComponent email={email} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-sm text-center shadow-2xl/20">
        <CardHeader>
          <CardTitle>Invalid Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please request a new password reset link.</p>
          <Button asChild variant="link">
            <Link href="/forgot-password">Request Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EnterCodeComponent({ email }: { email: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await verifyResetCode({ email, code: values.code });
      if (result.error) {
        setError(result.error);
      } else if (result.success && result.token) {
        router.push(`/reset-password/confirm?token=${result.token}`);
      }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-sm shadow-2xl/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to <strong>{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full justify-center">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Verifying..." : "Continue"}
              </Button>
              {error && (
                <p className="text-center text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function VerifyResetTokenComponent({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performVerification = async () => {
      const result = await verifyResetToken({ email, token });
      if (result.error) {
        setError(result.error);
      } else if (result.success && result.token) {
        router.push(`/reset-password/confirm?token=${result.token}`);
      }
    };
    performVerification();
  }, [token, email, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-sm text-center shadow-2xl/20">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <LoadingCard message="Verifying your reset link..." />;
}

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md text-center shadow-2xl/20">
        <CardHeader>
          <CardTitle className="text-2xl">{message}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
