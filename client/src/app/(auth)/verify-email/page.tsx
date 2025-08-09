'use client';

import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useTransition } from 'react';

import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { resendVerificationEmail, verifyEmail } from '../actions';

const otpSchema = z.object({
  code: z.string().min(6, 'Your one-time passwod must be 6 characters.'),
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <VerificationFlow />
    </Suspense>
  );
}

function VerificationFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (token) {
    return <VerifyTokenComponent token={token} email={email} />;
  }

  if (email) {
    return <CheckInboxComponent email={email} />;
  }

  return (
    <ErrorCard
      message="Invalid link. Please return to the signup page."
      showSignupLink={true}
    />
  );
}

function CheckInboxComponent({ email }: { email: string }) {
  const router = useRouter();
  const [isVerifying, startVerifying] = useTransition();
  const [isResending, startResending] = useTransition();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    if (!email) {
      toast.error('Email not found in URL');

      return;
    }

    startVerifying(async () => {
      const result = await verifyEmail({ email, code: values.code });

      if (result.error) {
        toast.error('Verification failed');

        form.reset();
      } else if (result?.success) {
        // const user = await getCurrentUser();
        // if (user) {
        //   router.push("/");
        // } else {
        //   router.push("/login");
        // }
        toast.success('Email verified successfully!');

        router.push('/');
      }
    });
  };

  const onResend = () => {
    startResending(async () => {
      const result = await resendVerificationEmail({ email });
      if (result.error) {
        toast.error('Failed to send email');
      } else {
        toast.success('A new verification email has been sent.');
        setCooldown(60);
      }
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl/20">
        <CardHeader className="text-start">
          <div className="mb-4 flex">
            <Logo variant="icon" />
          </div>
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to <strong>{email}</strong>.
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
                    <FormLabel>Verification Code</FormLabel>
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

              <div className="flex items-center gap-x-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto whitespace-nowrap"
                  onClick={() => router.back()}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-center justify-center space-y-4 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Didn't receive the email? Double check your spam folders.
          </p>
          <Button
            onClick={onResend}
            disabled={isResending || cooldown > 0}
            variant="secondary"
            className="w-full"
          >
            {isResending
              ? 'Sending...'
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Verification Email'}
          </Button>

          <div className="pt-4 text-center text-sm">
            <Link href="/signup" className="underline">
              Sign up for an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function VerifyTokenComponent({
  token,
  email,
}: {
  token: string;
  email: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setError('Invalid verification link: email is missing.');
      return;
    }

    const performVerification = async () => {
      const result = await verifyEmail({ token, email });
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    };
    performVerification();
  }, [token, email, router]);

  const searchParams = useSearchParams();
  if (searchParams.get('verified') === 'true') {
    return <SuccessCard />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  return <LoadingCard />;
}

function SuccessCard() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="text-start">
          <div className="mb-4 flex">
            <Logo variant="icon" />
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Email Verified!</CardTitle>
          <CardDescription>
            Thank you for verifying your email. Your account is now active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">Proceed to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorCard({
  message,
  showSignupLink = false,
}: {
  message: string;
  showSignupLink?: boolean;
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-2xl/20">
        <CardHeader className="text-start">
          <div className="mb-4 flex">
            <Logo variant="icon" />
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <CircleX className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Verification Failed</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {showSignupLink && (
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/signup">Return to Sign Up</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="text-start">
          <div className="mb-4 flex">
            <Logo variant="icon" />
          </div>
          <CardTitle className="text-2xl">Verifying...</CardTitle>
          <CardDescription>Please wait a moment.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
