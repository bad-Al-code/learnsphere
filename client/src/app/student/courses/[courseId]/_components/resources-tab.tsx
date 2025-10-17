'use client';

import type React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Code,
  Download,
  FileText,
  Image,
  LinkIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { Resource } from '../schema/course-detail.schema';

interface ResourcesTabProps {
  resources: Resource[];
}

const resourceTypeIcons: Record<Resource['type'], React.ReactNode> = {
  pdf: <FileText className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
  document: <BookOpen className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  image: <Image className="h-5 w-5" />,
};

export function ResourcesTab({ resources }: ResourcesTabProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  if (resources.length === 0) {
    return (
      <div className="border-border flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">No resources available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-muted-foreground mt-1">
                  {resourceTypeIcons[resource.type]}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {resource.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="ml-2">
                {resource.type}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              onClick={() => {
                setSelectedResource(resource);
                setShowDownloadDialog(true);
              }}
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              {resource.type === 'link' ? 'Open Link' : 'Download'}
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Download Dialog */}
      <AlertDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
      >
        <AlertDialogContent>
          <AlertDialogTitle>{selectedResource?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedResource?.type === 'link'
              ? `Open this resource: ${selectedResource.url}`
              : `Download ${selectedResource?.title}?`}
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedResource?.type === 'link') {
                  window.open(selectedResource.url, '_blank');
                }
                setShowDownloadDialog(false);
              }}
            >
              {selectedResource?.type === 'link' ? 'Open' : 'Download'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
