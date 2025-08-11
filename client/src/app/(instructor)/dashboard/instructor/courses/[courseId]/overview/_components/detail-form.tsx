'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateCourseDetails } from '@/app/(instructor)/actions';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { updateCourseSchema, UpdateCourseValues } from '@/lib/schemas/course';

interface DetailsFormProps {
  initialData: UpdateCourseValues & { id: string };
  courseId: string;
  categories: { label: string; value: string }[];
}

export function DetailsForm({
  initialData,
  courseId,
  categories,
}: DetailsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateCourseValues>({
    resolver: zodResolver(updateCourseSchema) as Resolver<UpdateCourseValues>,
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      categoryId: initialData.categoryId || null,
      level: initialData.level || 'all-levels',
      price: initialData.price ?? null,
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = (values: UpdateCourseValues) => {
    startTransition(async () => {
      const result = await updateCourseDetails(courseId, values);
      if (result?.error) {
        toast.error('Update failed', { description: result.error });
      } else {
        toast.success('Course details updated.');
        router.refresh();
        form.reset(values);
      }
    });
  };

  return (
    <div className="mt-6 rounded-md border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all-levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (INR)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isPending || !isDirty}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
