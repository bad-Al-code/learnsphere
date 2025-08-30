'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, FileText, Star, Upload } from 'lucide-react';

type TTemplate = {
  id: string;
  title: string;
  category: string;
  rating: number;
  description: string;
  sections: string[];
  downloads: number;
};

const templatesData: TTemplate[] = [
  {
    id: '1',
    title: 'Research Paper Template',
    category: 'Research',
    rating: 4.8,
    description: 'Standard academic research paper structure with citations',
    sections: [
      'Abstract',
      'Introduction',
      'Literature Review',
      'Methodology',
      'Results',
      'Discussion',
      'Conclusion',
    ],
    downloads: 245,
  },
  {
    id: '2',
    title: 'Code Project Template',
    category: 'Programming',
    rating: 4.6,
    description: 'Software development project with documentation',
    sections: [
      'README',
      'Setup Instructions',
      'Code Structure',
      'Testing',
      'Documentation',
    ],
    downloads: 189,
  },
  {
    id: '3',
    title: 'Case Study Template',
    category: 'Business',
    rating: 4.7,
    description: 'Business case study analysis framework',
    sections: [
      'Executive Summary',
      'Problem Statement',
      'Analysis',
      'Recommendations',
      'Implementation',
    ],
    downloads: 156,
  },
];

function TemplateCard({ template }: { template: TTemplate }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.category}</CardDescription>
        <CardAction className="flex flex-shrink-0 items-center gap-1 font-bold text-yellow-400">
          <Star className="h-4 w-4 fill-current" />
          <span>{template.rating}</span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-grow space-y-2">
        <p className="text-muted-foreground text-sm">{template.description}</p>
        <div>
          <h4 className="text-sm font-semibold">Sections included:</h4>
          <div className="mt-2 flex flex-wrap gap-1">
            {template.sections.map((section) => (
              <Badge key={section} variant="secondary">
                {section}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <p className="text-muted-foreground text-xs">
          {template.downloads} downloads
        </p>
        <TooltipProvider>
          <div className="flex w-full items-center gap-2">
            <Button className="flex-grow">
              <Upload className="h-4 w-4" />
              Use Template
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

function TemplateCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-5 w-12" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Skeleton className="h-3 w-20" />
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function TemplatesTab() {
  return (
    <div className="space-y-2">
      <header>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Assignment Templates</h2>
        </div>
        <p className="text-muted-foreground">
          Use proven templates to structure your assignments effectively
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {templatesData.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

export function TemplatesTabSkeleton() {
  return (
    <div className="space-y-2">
      <header>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-80" />
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
      </div>
    </div>
  );
}
