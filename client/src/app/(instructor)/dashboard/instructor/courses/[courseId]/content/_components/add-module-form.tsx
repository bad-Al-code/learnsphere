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
import { moduleSchema, ModuleSchemaValues } from "@/lib/schemas/module";
import { createModule } from "../../actions";

export function AddModuleForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ModuleSchemaValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (values: ModuleSchemaValues) => {
    startTransition(async () => {
      const result = await createModule(courseId, values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Module created successfully!");

        form.reset();

        router.refresh();
      }
    });
  };

  return (
    <div className="mt-6 border  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Add a new module
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
                    placeholder="e.g., 'Introduction to...'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            <PlusCircle className="h-4 w-4 mr-0" />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
