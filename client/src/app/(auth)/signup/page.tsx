"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { GoogleIcon } from "@/components/icons/google";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signup } from "../actions";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  function onSubmit(values: FormSchema) {
    setError(null);
    startTransition(async () => {
      const result = await signup(values);

      if (result?.error) {
        setError(result.error);
      }

      if (result?.success && result.email) {
        router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
      }
    });
  }

  return (
    <div className=" flex flex-col items-center justify-center min-h-[90vh]">
      <Card className="shadow-2xl/20  w-full max-w-md min-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Choose your preferred sign up method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <Button asChild variant="secondary">
              <Link
                href={`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/google`}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign up with Google
              </Link>
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <div className="bg-background px-2 text-muted-foreground">OR</div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Choose a password"
                          {...field}
                        />
                      </FormControl>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                        {showPassword ? (
                          <EyeOff
                            className="h-5 w-5"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="h-5 w-5"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link
                            href="/legal/terms"
                            className="underline"
                            target="_blank"
                          >
                            Terms of Service
                          </Link>
                          .
                        </FormLabel>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign Up"}
              </Button>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
