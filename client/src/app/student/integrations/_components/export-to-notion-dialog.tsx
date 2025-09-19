'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEnrolledCourses } from '@/features/ai-tools/hooks/useAiConversations';
import { FileText, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useExportCourseToNotion } from '../hooks/useIntegrations';

function EnrolledCourseList({
  onExport,
}: {
  onExport: (courseId: string) => void;
}) {
  const { data: courses, isLoading } = useGetEnrolledCourses();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-h-[300px] space-y-2 overflow-y-auto">
      {courses?.map((enrollment) => (
        <div
          key={enrollment.enrollmentId}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <p className="font-medium">{enrollment.course.title}</p>

          <Button size="sm" onClick={() => onExport(enrollment.course.id)}>
            Export
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ExportToNotionDialog() {
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null);
  const { mutate: exportToNotion, isPending } = useExportCourseToNotion();

  const handleExport = (courseId: string) => {
    setTargetCourseId(courseId);
    toast.info('Exporting to Notion... This may take a moment.');

    exportToNotion(
      { courseId },
      {
        onSuccess: (result) => {
          if (result.data) {
            toast.success('Course Hub created in Notion!', {
              action: (
                <Link href={result.data.pageUrl} target="_blank">
                  <Button variant="secondary" size="sm">
                    Open Page <LinkIcon className="h-4 w-4" />
                  </Button>
                </Link>
              ),
            });
          } else {
            toast.error(result.error);
          }
        },

        onError: (err) => toast.error(err.message),
        onSettled: () => setTargetCourseId(null),
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4" />
          Manage
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Course Hub to Notion</DialogTitle>
          <DialogDescription>
            Select a course to export its outline, your smart notes, and your
            research findings into a new page in your Notion workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <EnrolledCourseList onExport={handleExport} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
