'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, PenSquare } from 'lucide-react';

export interface Template {
  title: string;
  subject: string;
  bodyPreview: string;
}

interface TemplateCardProps {
  data: Template;
}

export function TemplateCard({ data }: TemplateCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>Subject: {data.subject}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {data.bodyPreview}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" className="">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button className="">
          <PenSquare className="h-4 w-4" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TemplateCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Skeleton className="h-10 w-full flex-1 sm:w-auto" />
        <Skeleton className="h-10 w-full flex-1 sm:w-auto" />
      </CardFooter>
    </Card>
  );
}
