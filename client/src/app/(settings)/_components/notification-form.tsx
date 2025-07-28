"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateNotificationSettings } from "../actions";

const notificationsSchema = z.object({
  newCourseAlerts: z.boolean(),
  weeklyNewsletter: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

interface NotificationsFormProps {
  settings: {
    notifications: {
      newCourseAlerts: boolean;
      weeklyNewsletter: boolean;
    };
  };
}

export function NotificationsForm({ settings }: NotificationsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      newCourseAlerts: settings.notifications.newCourseAlerts,
      weeklyNewsletter: settings.notifications.weeklyNewsletter,
    },
  });

  function onSubmit(data: NotificationsFormValues) {
    startTransition(async () => {
      const result = await updateNotificationSettings(data);
      if (result?.error) {
        toast.error("Failed to update settings", { description: result.error });
      } else {
        toast.success("Notification settings updated!");
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newCourseAlerts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">New Course Alerts</FormLabel>
                <FormDescription>
                  Get notified when new courses are published on the platform.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weeklyNewsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Weekly Newsletter</FormLabel>
                <FormDescription>
                  Receive a weekly roundup of popular courses and platform news.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
