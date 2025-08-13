'use client';

import {
  File,
  FileText,
  Link as LinkIcon,
  PlusCircle,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState(initialResources);

  const onResourceCreated = (newResource: Resource) => {
    setResources((prev) => [...prev, newResource]);
    router.refresh();
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
            <Link
              key={resource.id}
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              {/* className="bg-background flex items-center gap-x-3 rounded-md border p-3" */}
              <Card className="hover:bg-accent bg-background rounded-md transition hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-2">
                  {getFileIcon(resource.fileUrl)}
                  <CardTitle className="line-clamp-1 text-base font-medium">
                    {resource.title}
                  </CardTitle>
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
            </Link>
          ))}
        </div>
      )}

      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        onResourceCreated={onResourceCreated}
      />
    </div>
  );
}
