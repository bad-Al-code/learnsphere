'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateProfile as completeOnboarding } from '@/app/(settings)/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { onboardingFormSchema, OnboardingFormValues } from '@/lib/schemas/user';
import { CalendarIcon, Github, Linkedin, Twitter } from 'lucide-react';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface OnboardingFormProps {
  userData: {
    email: string;
    headline: string | null;
    bio: string | null;
    websiteUrl: string | null;
    socialLinks?: {
      github?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    } | null;
  };
  onSuccess?: () => void;
}

export function OnboardingForm({ userData, onSuccess }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      email: userData.email,
      headline: userData.headline || '',
      bio: userData.bio || '',
      websiteUrl: userData.websiteUrl || '',
      dateOfBirth: null,
      socialLinks: {
        github: userData.socialLinks?.github || '',
        linkedin: userData.socialLinks?.linkedin || '',
        twitter: userData.socialLinks?.twitter || '',
      },
    },
  });

  async function onSubmit(values: OnboardingFormValues) {
    startTransition(async () => {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? new Date(
              Date.UTC(
                values.dateOfBirth.getFullYear(),
                values.dateOfBirth.getMonth(),
                values.dateOfBirth.getDate()
              )
            )
          : null,
      };
      const result = await completeOnboarding(payload);

      if (result?.error) {
        toast.error(result.error || 'Update Failed');
      } else {
        toast.success('Profile completed!');
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    selected={field.value ?? undefined}
                    onSelect={(d) => field.onChange(d ?? null)}
                    disabled={(d) =>
                      d > new Date() || d < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Lifelong Learner & Aspiring Developer"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about your learning goals."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-portfolio.com"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormLabel>Social Links (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="socialLinks.github"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Github className="text-muted-foreground h-4 w-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                      className="pl-10"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialLinks.linkedin"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Linkedin className="text-muted-foreground h-4 w-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                      className="pl-10"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Twitter className="text-muted-foreground h-4 w-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://twitter.com/username"
                      {...field}
                      className="pl-10"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Complete Profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
