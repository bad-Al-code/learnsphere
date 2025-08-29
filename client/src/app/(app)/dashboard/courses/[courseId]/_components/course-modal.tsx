'use client';

import { RichTextEditor } from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateLessonFormValues,
  createLessonSchema,
} from '@/lib/schemas/lesson';
import { ModuleSchemaValues, moduleSchema } from '@/lib/schemas/module';
import { cn } from '@/lib/utils';
import { Module } from '@/types/module';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FileUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createLesson, createModule } from '../../actions';

interface FormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  form: React.ReactNode;
  footer: React.ReactNode;
}

export function FormDialog({
  trigger,
  title,
  description,
  form,
  footer,
}: FormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">{form}</div>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddModuleForm({
  courseId,
  onModuleCreated,
}: {
  courseId: string;
  onModuleCreated: (newModule: Module) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ModuleSchemaValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: '', isPublished: false },
  });

  const onSubmit = (values: ModuleSchemaValues) => {
    startTransition(async () => {
      const result = await createModule(courseId, values);

      if (result.error) {
        toast.error('Failed to create module', { description: result.error });
      } else {
        toast.success('Module created successfully!');

        onModuleCreated(result.data);
        form.reset();
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>
            Create a new module for your course content.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'Introduction to...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Publish</FormLabel>
                    <FormDescription>
                      Make this module visible to students immediately.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Module'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AddLessonForm({
  courseId,
  moduleId,
}: {
  courseId: string;
  moduleId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateLessonFormValues>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: '',
      lessonType: 'text',
      isPublished: false,
      content: '',
    },
  });

  const lessonType = form.watch('lessonType');

  const onSubmit = (values: CreateLessonFormValues) => {
    startTransition(async () => {
      const result = await createLesson(courseId, moduleId, values);
      if (result.error) {
        toast.error('Failed to create lesson', { description: result.error });
      } else {
        toast.success('Lesson created successfully!');
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add a lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson in this module.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'React Hooks'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lessonType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="quiz" disabled>
                        Quiz (Coming Soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {lessonType === 'video' && (
              <div className="bg-muted text-muted-foreground rounded-lg border p-4 text-center text-sm">
                You can add a video to this lesson after it has been created.
              </div>
            )}

            {lessonType === 'text' && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Publish</FormLabel>
                    <FormDescription>
                      Make this lesson visible immediately.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Lesson'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateAssignmentForm() {
  const [date, setDate] = useState<Date>();
  return (
    <>
      <div className="grid gap-2">
        <Label>Assignment Title</Label>
        <Input placeholder="Enter assignment title" />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea placeholder="Describe the assignment requirements" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>Points</Label>
          <Input type="number" placeholder="100" />
        </div>
        <div className="grid gap-2">
          <Label>Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Due Date</Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'PPP') : <span>dd/mm/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

export function AddResourceForm() {
  return (
    <>
      <div className="grid gap-2">
        <Label>Resource Title</Label>
        <Input placeholder="Enter resource title" />
      </div>
      <div className="grid gap-2">
        <Label>Resource Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Content</Label>
        <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed">
          <Button variant="outline">
            <FileUp className="h-4 w-4" /> Choose File
          </Button>
          <span className="text-muted-foreground text-xs">or</span>
          <Input placeholder="Paste URL here..." />
        </div>
      </div>
    </>
  );
}

export function PageWithModals() {
  return (
    <div className="space-y-4 p-8">
      <h2 className="text-xl font-bold">Content Management</h2>
      <div className="flex gap-2">
        <FormDialog
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4" /> Add Module
            </Button>
          }
          title="Add New Module"
          description="Create a new module for your course content."
          form={
            <AddModuleForm
              courseId=""
              onModuleCreated={function (newModule: Module): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
          footer={<Button>Create Module</Button>}
        />
        <FormDialog
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4" /> Add Lesson
            </Button>
          }
          title="Add New Lesson"
          description="Create a new lesson in Introduction to Data Science."
          form={<AddLessonForm courseId={''} moduleId={''} />}
          footer={<Button>Create Lesson</Button>}
        />
      </div>

      <h2 className="text-xl font-bold">Assignment & Resource Management</h2>
      <div className="flex gap-2">
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Create Assignment
            </Button>
          }
          title="Create New Assignment"
          description="Set up a new assignment for your students."
          form={<CreateAssignmentForm />}
          footer={<Button>Create Assignment</Button>}
        />
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Resource
            </Button>
          }
          title="Add New Resource"
          description="Upload a file or add a link for students to access."
          form={<AddResourceForm />}
          footer={<Button>Add Resource</Button>}
        />
      </div>
    </div>
  );
}
