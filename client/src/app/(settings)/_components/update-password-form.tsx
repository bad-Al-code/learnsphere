'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updatePassword } from '@/app/(auth)/actions';
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
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required.' }),
  newPassword: z
    .string()
    .min(8, { message: 'New password must be at least 8 characters.' }),
});

type FormSchema = z.infer<typeof formSchema>;

export function UpdatePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: FormSchema) {
    startTransition(async () => {
      const result = await updatePassword(values);
      if (result?.error) {
        toast.error(result.error || 'Update Failed');
      } else {
        toast.success('Your password has been updated successfully!');
        form.reset();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      {...field}
                    />
                  </FormControl>
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowCurrent((s) => !s)}
                  >
                    {showCurrent ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type={showNew ? 'text' : 'password'} {...field} />
                  </FormControl>
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowNew((s) => !s)}
                  >
                    {showNew ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col justify-end gap-2 pt-2 md:flex-row md:items-center">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
