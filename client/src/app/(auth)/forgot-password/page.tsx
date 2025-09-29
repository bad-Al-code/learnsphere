'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '../actions';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, _setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    startTransition(async () => {
      const result = await forgotPassword(values);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(
          `/reset-password?email=${encodeURIComponent(values.email)}`
        );
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-2xl/20">
          <CardHeader className="text-start">
            <div className="mb-4 flex">
              <Logo variant="icon" />
            </div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <MailCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="mt-4 text-2xl">Check Your Inbox</CardTitle>
            <CardDescription>
              If an account with that email exists, we've sent a link to reset
              your password.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl/20">
        <CardHeader className="text-start">
          <div className="mb-4 flex">
            <Logo variant="icon" />
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            You'll receive a link to reset your password, if an account with
            your email exists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => router.back()}
                >
                  Back
                </Button>

                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? 'Sending...' : 'Reset Password'}
                </Button>
              </div>

              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}
            </form>
          </Form>

          <div className="text-muted-foreground hover:text-primary mt-6 text-center text-sm">
            <Link href="/login" className="underline">
              Login to your account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
