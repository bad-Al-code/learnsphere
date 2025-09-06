'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';

interface SettingsData {
  title: string;
  duration: string;
  status: 'Published' | 'Draft';
  allowComments: boolean;
  trackCompletion: boolean;
}

export function LessonSettingsForm() {
  const form = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Settings</CardTitle>
        <CardDescription>
          Manage the core details and visibility of your lesson.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Publish</FormLabel>
                <FormDescription>
                  Make this lesson visible to students.
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
      </CardContent>
    </Card>
  );
}

export function LessonSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
