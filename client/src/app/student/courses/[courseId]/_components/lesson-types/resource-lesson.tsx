'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Download, FileText, LinkIcon } from 'lucide-react';
import type { Lesson } from '../../schema/course-detail.schema';

interface ResourceLessonProps {
  lesson: Lesson;
}

export function ResourceLesson({ lesson }: ResourceLessonProps) {
  const resources = [
    { name: 'Lesson Slides', type: 'pdf', size: '2.4 MB' },
    { name: 'Source Code', type: 'code', size: '156 KB' },
    { name: 'Additional Reading', type: 'link', url: 'https://example.com' },
    { name: 'Cheat Sheet', type: 'pdf', size: '890 KB' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground text-sm">{lesson.description}</p>
      </div>

      <div className="space-y-3">
        {resources.map((resource, idx) => (
          <Card key={idx} className="hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {getIcon(resource.type)}
                </div>
                <div>
                  <p className="text-foreground font-medium">{resource.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {resource.size}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
