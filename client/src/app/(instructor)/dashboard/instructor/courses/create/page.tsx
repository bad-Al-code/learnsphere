'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getCategories } from '@/app/(admin)/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { CourseFormValues, courseSchema } from '@/lib/schemas/course';
import { Category } from '@/types/category';
import { PrerequisiteCourse } from '@/types/course';
import { createFullCourse, getMyCourses } from '../../../../actions';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<
    PrerequisiteCourse[]
  >([]);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
    getMyCourses().then((res) => {
      if (res.success && res.data) setInstructorCourses(res);
    });
  }, []);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'all-levels',
      status: 'draft',
      modules: [{ title: '' }],
      price: 0,
      duration: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  const onSubmit = (values: CourseFormValues) => {
    startTransition(async () => {
      const result = await createFullCourse(values);
      if (result.error) {
        toast.error('Failed to create course', { description: result.error });
      } else {
        toast.success('Course created successfully!');
        router.push(`/dashboard/instructor/courses/${result.data.id}/overview`);
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Create a New Course</h1>
      <p className="text-muted-foreground mt-2">
        Fill out the essential details for your course. You can add more content
        and fine-tune settings after creation.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 'Introduction to Python'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Learn the fundamentals of programming...'"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Course Thumbnail</FormLabel>
            <FormControl>
              <div className="bg-muted text-muted-foreground rounded-lg border p-4 text-center">
                You can upload a thumbnail on the next step.
              </div>
            </FormControl>
          </FormItem>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
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
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
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
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an initial status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  'Draft' courses are not visible to students. 'Published'
                  courses are live.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prerequisiteCourseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prerequisite Course (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur">
                    <SelectItem value="None">None</SelectItem>
                    {instructorCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 180"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : +value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Total estimated video time.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (INR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 499"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : +value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty or 0 for a free course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-lg font-semibold">
              Initial Modules
            </FormLabel>
            <FormDescription>
              Create the first few modules for your course. You can add more
              later.
            </FormDescription>
            <div className="mt-4 space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`modules.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            placeholder={`Module ${
                              index + 1
                            }: e.g., Introduction`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ title: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Module
            </Button>
            <FormMessage>
              {form.formState.errors.modules?.root?.message ||
                form.formState.errors.modules?.message}
            </FormMessage>
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard/instructor/courses')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save and Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
