"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CreateLessonFormValues,
  createLessonSchema,
} from "@/lib/schemas/lesson";
import { createLesson } from "../../../actions";

interface AddLessonFormProps {
  courseId: string;
  moduleId: string;
}

export function AddLessonForm({ courseId, moduleId }: AddLessonFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateLessonFormValues>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (values: CreateLessonFormValues) => {
    startTransition(async () => {
      const result = await createLesson(courseId, moduleId, values);
      if (result.error) {
        toast.error("Failed to create lesson", { description: result.error });
      } else {
        toast.success("Lesson created successfully!");
        form.reset();
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-6 borderrounded-md p-0">
      <div className="font-medium flex items-center justify-between">
        Add a new lesson
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-x-2 mt-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="e.g., 'What are React Hooks?'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
