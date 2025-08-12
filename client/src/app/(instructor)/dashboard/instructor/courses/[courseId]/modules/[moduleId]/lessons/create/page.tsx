'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonFormValues, lessonSchema } from '@/lib/schemas/lesson';
import { createLesson } from '../../../../actions';

function LessonForm({
  courseId,
  moduleId,
}: {
  courseId: string;
  moduleId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { title: '' },
  });

  const lessonType = form.watch('lessonType');

  const onSubmit = (values: LessonFormValues) => {
    startTransition(async () => {
      const result = await createLesson(courseId, moduleId, values);
      if (result.error) {
        toast.error('Failed to create lesson', { description: result.error });
      } else {
        toast.success('Lesson created successfully!');
        router.push(
          `/dashboard/instructor/courses/${courseId}/modules/${moduleId}`
        );
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Lesson</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g., 'Introduction to React Hooks'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lessonType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lesson type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="quiz" disabled>
                        Quiz (Coming Soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {lessonType === 'video' && (
              <div className="bg-muted text-muted-foreground rounded-lg border p-4 text-center">
                Video uploader will go here after the lesson is created.
              </div>
            )}

            {lessonType === 'text' && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isPending ? 'Adding Lesson...' : 'Add Lesson'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function LessonFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}

export default function AddLessonPage() {
  const params = useParams<{ courseId: string; moduleId: string }>();
  const courseId = params.courseId;
  const moduleId = params.moduleId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/instructor/courses/${courseId}/modules/${moduleId}`}
          className="transition-opacity hover:opacity-75"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Add a Lesson</h1>
      </div>

      <Suspense fallback={<LessonFormSkeleton />}>
        <LessonForm courseId={courseId} moduleId={moduleId} />
      </Suspense>
    </div>
  );
}
