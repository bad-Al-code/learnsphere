"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { createCourseSchema, CreateCourseValues } from "@/lib/schemas/course";
import { createCourse } from "../../../../actions";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = (values: CreateCourseValues) => {
    startTransition(async () => {
      const result = await createCourse(values);
      if (result.error) {
        toast.error("Failed to create course", { description: result.error });
      } else {
        toast.success("Course created successfully!");

        router.push(`/dashboard/instructor/courses/${result.data.id}`);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Create a New Course</h1>
      <p className="text-muted-foreground mt-2">
        Start by giving your course a title and description. You can edit all
        other details later.
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
                    placeholder="e.g., 'Learn the fundamentals of programming with Python...'"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard/instructor/courses")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create and Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
