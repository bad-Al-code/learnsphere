'use client';

import { FileUploader } from '@/components/shared/file-uploader';
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
import { Progress } from '@/components/ui/progress';
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
  CreateAssignmentFormValues,
  createAssignmentSchema,
} from '@/lib/schemas/assignment';
import {
  addResourceFormSchema,
  AddResourceFormValues,
  CreateResourceValues,
} from '@/lib/schemas/course';
import { LessonFormValues, lessonSchema } from '@/lib/schemas/lesson';
import { moduleSchema, ModuleSchemaValues } from '@/lib/schemas/module';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types/lesson';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Upload, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  createAssignment,
  createLesson,
  createModule,
  createResource,
  getResourceUploadUrl,
} from '../../actions';

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

export function AddModuleForm({ courseId }: { courseId: string }) {
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
        form.reset();
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Add Module
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

interface AddLessonFormProps {
  courseId: string;
  moduleId: string;
  onLessonCreated: (newLesson: Lesson) => void;
  setDialogOpen: (isOpen: boolean) => void;
}

export function AddLessonForm({
  courseId,
  moduleId,
  onLessonCreated,
  setDialogOpen,
}: AddLessonFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema) as Resolver<LessonFormValues>,
    defaultValues: {
      title: '',
      lessonType: 'text',
      content: '',
      isPublished: false,
      duration: 0,
    },
  });

  const lessonType = form.watch('lessonType');

  const onSubmit = (values: LessonFormValues) => {
    startTransition(async () => {
      const result = await createLesson(courseId, moduleId, values);
      if (result.error) {
        toast.error('Failed to create lesson', { description: result.error });
      } else {
        toast.success('Lesson created successfully!');
        onLessonCreated(result.data);
        form.reset();
        setDialogOpen(false);
      }
    });
  };

  const renderLessonContent = () => {
    switch (lessonType) {
      case 'video':
        return (
          <div className="grid gap-2">
            <Label>Video Content</Label>

            <div className="flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-2">
              <Upload className="text-muted-foreground mb-2 h-8 w-8" />
              <Button variant="outline">
                <Video className="h-4 w-4" /> Upload Video
              </Button>
              <Input className="mt-2" placeholder="Or paste video URL..." />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Quiz Content</Label>
              <Textarea placeholder="Quiz instructions and description..." />
            </div>
            <div className="grid gap-2">
              <Label>Sample Question</Label>
              <Input placeholder="Enter your question..." />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <Input placeholder="Option A" />
              <Input placeholder="Option B" />
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="grid gap-2">
            <Label>Text Content</Label>
            <Textarea
              placeholder="Write your lesson content here..."
              className="min-h-32"
            />
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter lesson title" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text/Reading</SelectItem>
                  <SelectItem value="video">Video Lesson</SelectItem>
                  <SelectItem value="quiz" disabled>
                    Quiz (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {renderLessonContent()}

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Publish</FormLabel>
                <FormDescription>
                  Make this lesson visible to students upon creation.
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

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 15" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDialogOpen(false)}
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
  );
}

interface CreateAssignmentFormProps {
  courseId: string;
  moduleOptions: { label: string; value: string }[];
  setDialogOpen: (isOpen: boolean) => void;
}

export function CreateAssignmentForm({
  courseId,
  moduleOptions,
  setDialogOpen,
}: CreateAssignmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(
      createAssignmentSchema
    ) as Resolver<CreateAssignmentFormValues>,
    defaultValues: {
      title: '',
      description: '',
      moduleId: undefined,
      dueDate: null,
      status: 'draft',
    },
  });

  const onSubmit = (values: CreateAssignmentFormValues) => {
    startTransition(async () => {
      const result = await createAssignment(courseId, values);

      if (result.error) {
        toast.error('Failed to create assignment', {
          description: result.error,
        });
      } else {
        toast.success('Assignment created!');
        form.reset();
        setDialogOpen(false);

        router.refresh();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {moduleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Publish</FormLabel>
                <FormDescription>
                  Make this assignment visible to students immediately.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === 'published'}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? 'published' : 'draft')
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDialogOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Assignment'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface AddResourceModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddResourceModal({
  courseId,
  isOpen,
  onClose,
}: AddResourceModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<AddResourceFormValues>({
    resolver: zodResolver(addResourceFormSchema),
    defaultValues: {
      title: '',
      status: 'draft',
    },
  });

  const onSubmit = (values: AddResourceFormValues) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    startTransition(async () => {
      try {
        const urlResult = await getResourceUploadUrl(
          courseId,
          selectedFile.name
        );
        if (urlResult.error || !urlResult.data?.signedUrl) {
          throw new Error(urlResult.error || 'Could not get upload URL.');
        }

        await axios.put(urlResult.data.signedUrl, selectedFile, {
          headers: { 'Content-Type': selectedFile.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total ?? selectedFile.size)
            );
            setUploadProgress(percent);
          },
        });

        const resourcePayload: CreateResourceValues = {
          title: values.title,
          status: values.status,
          fileUrl: urlResult.data.finalUrl,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        };

        const createResult = await createResource(courseId, resourcePayload);
        if (createResult.error) throw new Error(createResult.error);

        toast.success('Resource created successfully!');
        onClose();
        router.refresh();
      } catch (err: any) {
        toast.error('Something went wrong', { description: err.message });
      } finally {
        form.reset();
        setSelectedFile(null);
        setUploadProgress(0);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            Upload a file and give it a title for your students.
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
                  <FormLabel>Resource Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileUploader
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onFileRemove={() => setSelectedFile(null)}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Publish</FormLabel>
                    <FormDescription>
                      Make this resource visible to students.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'published'}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 'published' : 'draft')
                      }
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isPending && (
              <div className="flex w-full items-center gap-2">
                <Progress value={uploadProgress} className="flex-1" />
                <p className="text-muted-foreground text-sm">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !selectedFile}>
                {isPending ? 'Uploading...' : 'Save Resource'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
