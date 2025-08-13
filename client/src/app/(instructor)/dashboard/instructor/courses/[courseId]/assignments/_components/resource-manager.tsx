'use client';

import {
  File,
  FileText,
  Link as LinkIcon,
  Pencil,
  PlusCircle,
  Trash2,
  Video,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { deleteResource, updateResource } from '../../actions';
import { AddResourceModal } from './add-resource-modal';

type Resource = {
  id: string;
  title: string;
  fileUrl: string;
};

interface ResourcesManagerProps {
  initialResources: Resource[];
  courseId: string;
}

export function ResourcesManager({
  initialResources,
  courseId,
}: ResourcesManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState(initialResources);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(
    null
  );

  const onResourceCreated = (newResource: Resource) => {
    const params = new URLSearchParams(searchParams);
    params.set('resourcePage', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setNewTitle(resource.title);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingResource || !newTitle.trim()) return;

    const res = await updateResource(courseId, editingResource.id, {
      title: newTitle,
    });
    if (!res.error) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingResource.id ? { ...r, title: newTitle } : r
        )
      );
      setEditDialogOpen(false);
      setEditingResource(null);
    } else {
      alert(res.error);
    }
  };

  const openDeleteDialog = (resource: Resource) => {
    setDeletingResource(resource);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingResource) return;

    const res = await deleteResource(courseId, deletingResource.id);
    if (!res.error) {
      setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
      setDeleteDialogOpen(false);
      setDeletingResource(null);
    } else {
      alert(res.error);
    }
  };

  const getFileIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    const iconClass = 'h-5 w-5 flex-shrink-0';
    if (lowerUrl.endsWith('.pdf'))
      return <FileText className={`${iconClass} text-red-500`} />;
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com'))
      return <Video className={`${iconClass} text-purple-500`} />;
    if (lowerUrl.startsWith('http'))
      return <LinkIcon className={`${iconClass} text-blue-500`} />;
    return <File className={`${iconClass} text-gray-500`} />;
  };

  const getFileTypeLabel = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf')) return 'PDF';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com'))
      return 'Video';
    if (lowerUrl.startsWith('http')) return 'Link';
    return 'File';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Course Resources</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No resources have been added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="hover:bg-background/50 bg-background rounded-md transition hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                {getFileIcon(resource.fileUrl)}
                <CardTitle className="line-clamp-1 flex-1 text-base font-medium">
                  <Link
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.title}
                  </Link>
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    title="Edit Resource"
                    size="icon"
                    onClick={() => openEditDialog(resource)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={
                      deleteDialogOpen && deletingResource?.id === resource.id
                    }
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        title="Delete Resource"
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(resource)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resource.title}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-muted-foreground group-hover:text-primary truncate text-sm">
                  {resource.fileUrl}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground group-hover:text-secondary-foreground group-hover:bg-background flex-shrink-0"
                >
                  {getFileTypeLabel(resource.fileUrl)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        onResourceCreated={onResourceCreated}
      />

      {/* Edit Resource Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
