import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Download,
  ExternalLink,
  File,
  FileCode,
  FileText,
  Image,
  Link,
  Video,
} from 'lucide-react';
import { useResourcesForLesson } from '../hooks/use-course-detail';

interface ResourceLessonProps {
  lessonId: string;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'document':
      return File;
    case 'code':
      return FileCode;
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'link':
      return Link;
    default:
      return File;
  }
};

const getResourceColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-red-500 bg-red-500/10';
    case 'document':
      return 'text-blue-500 bg-blue-500/10';
    case 'code':
      return 'text-purple-500 bg-purple-500/10';
    case 'image':
      return 'text-green-500 bg-green-500/10';
    case 'video':
      return 'text-orange-500 bg-orange-500/10';
    case 'link':
      return 'text-cyan-500 bg-cyan-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export function ResourceLesson({ lessonId }: ResourceLessonProps) {
  const {
    data: resources,
    isLoading,
    error,
    refetch,
  } = useResourcesForLesson(lessonId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;

  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        title="No Resources Available"
        description="There are no resources for this lesson yet."
        icon="file"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-2 text-xl font-semibold">Lesson Resources</h3>
        <p className="text-muted-foreground">
          Download or access the resources below to supplement your learning.
        </p>
      </Card>

      <div className="space-y-4">
        {resources.map((resource) => {
          const Icon = getResourceIcon(resource.type);
          const colorClass = getResourceColor(resource.type);

          return (
            <Card
              key={resource.id}
              className="p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-3 ${colorClass}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h4 className="text-lg font-semibold">{resource.title}</h4>
                    <Badge variant="outline" className="capitalize">
                      {resource.type}
                    </Badge>
                  </div>

                  {resource.description && (
                    <p className="text-muted-foreground mb-3 text-sm">
                      {resource.description}
                    </p>
                  )}

                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    {resource.fileSize && (
                      <span className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        {resource.fileSize}
                      </span>
                    )}
                    {resource.downloadCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.downloadCount} downloads
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {resource.type === 'link' ? (
                    <Button asChild variant="default">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Link
                      </a>
                    </Button>
                  ) : (
                    <>
                      {resource.downloadable && (
                        <Button asChild variant="default">
                          <a href={resource.url} download className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="outline">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
