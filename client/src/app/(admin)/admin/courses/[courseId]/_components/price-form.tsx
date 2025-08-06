"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateCoursePrice } from "@/app/(admin)/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PriceFormValues, priceSchema } from "@/lib/schemas/course";

interface PriceFormProps {
  courseId: string;
  initialPrice: number | null | undefined;
}

export function PriceForm({ courseId, initialPrice }: PriceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: { price: initialPrice || 0 },
  });

  const { isDirty } = form.formState;

  const onSubmit = (values: PriceFormValues) => {
    startTransition(async () => {
      const result = await updateCoursePrice(courseId, values);
      if (result.error) {
        toast.error("Update failed", { description: result.error });
      } else {
        toast.success("Course price updated!");
        form.reset({ price: values.price });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Price (USD)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 19.99"
                    className="pl-7"
                    {...field}
                    value={typeof field.value === "number" ? field.value : ""}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Leave blank or set to 0 for a free course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? "Saving..." : "Save Price"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
