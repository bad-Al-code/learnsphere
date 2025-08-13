'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { FileUploader } from '@/components/shared/file-uploader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { createResource, getResourceUploadUrl } from '../../actions';

type Resource = { id: string; title: string; fileUrl: string };
const formSchema = z.object({ title: z.string().min(1, 'Title is required.') });
type FormValues = z.infer<typeof formSchema>;

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onResourceCreated: (newResource: Resource) => void;
}

export function AddResourceModal({
  isOpen,
  onClose,
  courseId,
  onResourceCreated,
}: AddResourceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = (values: FormValues) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    startTransition(async () => {
      try {
        const { data: urlData, error: urlError } = await getResourceUploadUrl(
          courseId,
          selectedFile.name
        );
        if (urlError || !urlData?.signedUrl)
          throw new Error(urlError || 'Could not get upload URL.');

        await axios.put(urlData.signedUrl, selectedFile, {
          headers: { 'Content-Type': selectedFile.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total ?? selectedFile.size)
            );
            setUploadProgress(percent);
          },
        });

        const resourcePayload = {
          title: values.title,
          fileUrl: urlData.finalUrl,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        };
        const result = await createResource(courseId, resourcePayload);
        if (result.error) throw new Error(result.error);

        toast.success('Resource uploaded and created successfully!');
        onResourceCreated(result.data);
        onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Resource</DialogTitle>
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
            {isPending && <Progress value={uploadProgress} />}
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
