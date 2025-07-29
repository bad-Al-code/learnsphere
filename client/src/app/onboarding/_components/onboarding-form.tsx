"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { completeOnboarding } from "../actions";

const onboardingSchema = z.object({
  headline: z
    .string()
    .min(1, "A headline is required.")
    .max(100, "Headline is too long."),
  bio: z.string().max(500, "Bio is too long.").optional(),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  userData: {
    headline: string | null;
    bio: string | null;
    websiteUrl: string | null;
  };
}

export function OnboardingForm({ userData }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      headline: userData.headline || "",
      bio: userData.bio || "",
      websiteUrl: userData.websiteUrl || "",
    },
  });

  async function onSubmit(values: OnboardingFormValues) {
    startTransition(async () => {
      const result = await completeOnboarding(values);
      if (result?.error) {
        toast.error("Update Failed", { description: result.error });
      } else {
        toast.success("Profile completed!");
        router.push("/");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Lifelong Learner & Aspiring Developer"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about your learning goals."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://your-portfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Complete Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
