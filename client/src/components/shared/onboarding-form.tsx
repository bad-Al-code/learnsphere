"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  OnboardingInput,
  completeOnboarding,
} from "@/app/(settings)/settings/profile/actions";
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
import { Github, Linkedin, Twitter } from "lucide-react";

const onboardingSchema = z.object({
  headline: z
    .string()
    .min(1, "A headline is required.")
    .max(100, "Headline is too long."),
  bio: z.string().max(500, "Bio is too long.").optional(),
  websiteUrl: z.url().optional().or(z.literal("")),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    })
    .optional()
    .nullable(),
});

type OnboardingFormValues = OnboardingInput;

interface OnboardingFormProps {
  userData: {
    headline: string | null;
    bio: string | null;
    websiteUrl: string | null;
    socialLinks: {
      twitter: string | null;
      linkedin: string | null;
      github: string | null;
    };
  };
  onSuccess?: () => void;
}

export function OnboardingForm({ userData, onSuccess }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      headline: userData.headline || "",
      bio: userData.bio || "",
      websiteUrl: userData.websiteUrl || "",
      socialLinks: {
        github: userData.socialLinks?.github || "",
        linkedin: userData.socialLinks?.linkedin || "",
        twitter: userData.socialLinks?.twitter || "",
      },
    },
  });

  async function onSubmit(values: OnboardingFormValues) {
    console.log(values);
    startTransition(async () => {
      const result = await completeOnboarding(values);

      if (result?.error) {
        toast.error("Update Failed");
        console.log(result.error);
      } else {
        toast.success("Profile completed!");
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
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
        <div className="space-y-4">
          <FormLabel>Social Links (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="socialLinks.github"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialLinks.linkedin"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://twitter.com/username"
                      {...field}
                      className="pl-10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Complete Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
