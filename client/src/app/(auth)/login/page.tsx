"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { login } from "../actions";

const formSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const roter = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: FormSchema) {
    console.log(values);
    setError(null);

    startTransition(async () => {
      const result = await login(values);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isPending ? "Logging in..." : "Login"}
              </Button>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
