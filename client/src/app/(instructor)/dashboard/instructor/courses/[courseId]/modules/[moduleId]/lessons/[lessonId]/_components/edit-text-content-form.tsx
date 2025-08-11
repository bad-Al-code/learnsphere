'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { updateLesson } from '../../../../../actions';

const formSchema = z.object({
  content: z.string().min(1, 'Lesson content cannot be empty.'),
});
type FormValues = z.infer<typeof formSchema>;

interface EditTextContentFormProps {
  courseId: string;
  lessonId: string;
  initialContent: string | null | undefined;
}

export function EditTextContentForm({
  courseId,
  lessonId,
  initialContent,
}: EditTextContentFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: initialContent || '' },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await updateLesson(courseId, lessonId, {
        content: values.content,
      });
      if (result.error) {
        toast.error('Failed to update content', { description: result.error });
      } else {
        toast.success('Lesson content updated.');
        toggleEdit();
        router.refresh();
      }
    });
  };

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Lesson Content
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className="prose dark:prose-invert mt-2 max-w-none text-sm"
          dangerouslySetInnerHTML={{
            __html: initialContent || '<p>No content provided yet.</p>',
          }}
        />
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isPending}>
                Save Content
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
