'use client';

import { FileUploader } from '@/components/shared/file-uploader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Resource,
  updateResourceSchema,
  UpdateResourceValues,
} from '@/lib/schemas/course';
import { formatBytes } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  deleteResource,
  getResourceUploadUrl,
  updateResource,
} from '../../actions';

interface ResourcesListProps {
  initialResources: Resource[];
  courseId: string;
}

export function ResourcesList({
  initialResources,
  courseId,
}: ResourcesListProps) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [isPending, startTransition] = useTransition();
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingResource, setDeletingResource] = useState<Resource | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const form = useForm<UpdateResourceValues>({
    resolver: zodResolver(updateResourceSchema),
    defaultValues: {
      title: '',
      status: 'draft',
    },
  });

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    form.reset({
      title: resource.title,
      status: resource.status,
    });
  };

  const handleSaveEdit = (values: UpdateResourceValues) => {
    if (!editingResource) return;

    startTransition(async () => {
      try {
        let updatePayload = { ...values };

        if (selectedFile) {
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

          updatePayload = {
            ...updatePayload,
            fileUrl: urlResult.data.finalUrl,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
          };
        }

        const result = await updateResource(
          courseId,
          editingResource.id,
          updatePayload
        );

        if (result.error) throw new Error(result.error);

        toast.success('Resource updated successfully!');
        setEditingResource(null);

        router.refresh();
      } catch (err: any) {
        toast.error('Update failed', { description: err.message });
      } finally {
        setSelectedFile(null);
        setUploadProgress(0);
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingResource) return;

    const previousResources = resources;
    setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
    setDeletingResource(null);

    startTransition(() => {
      toast.promise(deleteResource(courseId, deletingResource.id), {
        loading: 'Deleting resource...',
        success: 'Resource deleted!',
        error: (err) => {
          setResources(previousResources);
          return err.message || 'Delete failed.';
        },
      });
    });
  };

  const handleTogglePublish = (resource: Resource) => {
    const previousResources = resources;
    const newStatus = resource.status === 'published' ? 'draft' : 'published';

    setResources((prev) =>
      prev.map((r) => (r.id === resource.id ? { ...r, status: newStatus } : r))
    );

    startTransition(() => {
      toast.promise(
        updateResource(courseId, resource.id, { status: newStatus }),
        {
          loading: 'Updating status...',
          success: 'Status updated!',
          error: (err) => {
            setResources(previousResources);
            return err.message || 'Status update failed.';
          },
        }
      );
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    {resource.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resource.fileName}
                  </TableCell>
                  <TableCell>{formatBytes(resource.fileSize)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        resource.status === 'published'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(resource)}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(resource)}
                        >
                          {resource.status === 'published' ? (
                            <>
                              <EyeOff className="h-4 w-4" /> Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" /> Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingResource(resource)}
                          className="text-destructive hover:!text-destructive focus:!text-destructive"
                        >
                          <Trash2 className="text-destructive h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No resources found for this course.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editingResource}
        onOpenChange={(isOpen) => !isOpen && setEditingResource(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveEdit)}
              className="space-y-4 py-4"
            >
              <FormField
                name="title"
                control={form.control}
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

              <FormItem>
                <FormLabel>Replace File (Optional)</FormLabel>
                <FormControl>
                  <FileUploader
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                    onFileRemove={() => setSelectedFile(null)}
                  />
                </FormControl>
              </FormItem>

              <FormField
                name="status"
                control={form.control}
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isPending && selectedFile && <Progress value={uploadProgress} />}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingResource(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingResource}
        onOpenChange={() => setDeletingResource}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resource "{deletingResource?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
