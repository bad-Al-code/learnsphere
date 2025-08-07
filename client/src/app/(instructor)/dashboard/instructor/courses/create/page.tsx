"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCourseSchema, CreateCourseValues } from "@/lib/schemas/course";
import { PlusCircle, Trash2 } from "lucide-react";
import { createCourse } from "../../../../actions";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "all-levels",
      status: "draft",
      modules: [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-lg font-semibold">Modules</FormLabel>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ title: "" })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Module
            </Button>
            <FormMessage>{form.formState.errors.modules?.message}</FormMessage>
          </div>

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
