'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FilePlus } from 'lucide-react';
import { Template, TemplateCard, TemplateCardSkeleton } from './template-card';

const placeholderTemplates: Template[] = [
  {
    title: 'Assignment Extension',
    subject: 'Re: Extension Request',
    bodyPreview:
      'Thank you for reaching out. I understand your situation and can offer a 2-day extension. Please submit by [new date]....',
  },
  {
    title: 'General Feedback',
    subject: 'Re: Assignment Feedback',
    bodyPreview:
      'Thank you for your submission. Overall, your work demonstrates good understanding of the concepts. Here are...',
  },
  {
    title: 'Office Hours Invitation',
    subject: 'Office Hours Available',
    bodyPreview:
      "I'd be happy to discuss this further during my office hours. I'm available [days/times]. Please feel free to stop b...",
  },
];

interface MessageTemplatesProps {
  data?: Template[];
}

export function MessageTemplates({
  data = placeholderTemplates,
}: MessageTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Message Templates</h2>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((template) => (
          <TemplateCard key={template.title} data={template} />
        ))}
      </div>
    </div>
  );
}

export function MessageTemplatesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <TemplateCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
