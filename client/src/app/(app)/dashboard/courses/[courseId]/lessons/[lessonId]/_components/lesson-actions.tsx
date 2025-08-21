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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Download, Share2, Trash2 } from 'lucide-react';

export interface LessonActionsProps {
  onDuplicate: () => void;
  onExport: () => void;
  onShare: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function LessonActions({
  onDuplicate,
  onExport,
  onShare,
  onDelete,
  isDeleting = false,
}: LessonActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4" />
          <span>Duplicate Lesson</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span>Export Content</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Share Lesson</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Lesson</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                lesson and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete lesson'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export function LessonActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
