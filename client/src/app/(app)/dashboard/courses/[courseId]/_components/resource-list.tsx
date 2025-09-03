'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Resource } from '@/lib/schemas/course';
import { formatBytes } from '@/lib/utils';
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteResource, updateResource } from '../../actions';

interface ResourcesListProps {
  initialResources: Resource[];
  courseId: string;
}

export function ResourcesList({
  initialResources,
  courseId,
}: ResourcesListProps) {
  const [resources, setResources] = useState(initialResources);
  const [isPending, startTransition] = useTransition();

  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingResource, setDeletingResource] = useState<Resource | null>(
    null
  );

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setNewTitle(resource.title);
  };

  const handleSaveEdit = () => {
    if (
      !editingResource ||
      !newTitle.trim() ||
      newTitle === editingResource.title
    ) {
      setEditingResource(null);
      return;
    }

    const previousResources = resources;
    setResources((prev) =>
      prev.map((r) =>
        r.id === editingResource.id ? { ...r, title: newTitle } : r
      )
    );
    setEditingResource(null);

    startTransition(() => {
      toast.promise(
        updateResource(courseId, editingResource.id, { title: newTitle }),
        {
          loading: 'Updating resource...',
          success: 'Resource updated!',

          error: (err) => {
            setResources(previousResources);
            return err.message || 'Update failed.';
          },
        }
      );
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

      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource Title</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resource-title">Title</Label>
            <Input
              id="resource-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingResource(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
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
