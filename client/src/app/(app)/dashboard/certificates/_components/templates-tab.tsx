'use client';

import { Badge } from '@/components/ui/badge';
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
import { Eye, PenSquare, Plus } from 'lucide-react';
import Image from 'next/image';

interface TemplateData {
  title: string;
  description: string;
  imageUrl: string;
  isDefault?: boolean;
}

const placeholderData: TemplateData[] = [
  {
    title: 'Classic Certificate',
    description: 'Traditional formal certificate design',
    imageUrl: 'https://i.imgur.com/L7gRb2z.png',
    isDefault: true,
  },
  {
    title: 'Modern Certificate',
    description: 'Clean, contemporary design',
    imageUrl: 'https://i.imgur.com/Y0j9j2b.png',
  },
  {
    title: 'Elegant Certificate',
    description: 'Sophisticated design with decorative elements',
    imageUrl: 'https://i.imgur.com/c1o4aY6.png',
  },
];

function TemplateCard({ data }: { data: TemplateData }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2">
          <CardTitle>{data.title}</CardTitle>
          {data.isDefault && <Badge>Default</Badge>}
        </div>
        <CardDescription>{data.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4" /> Preview
        </Button>
        <Button variant="outline" className="flex-1">
          <PenSquare className="h-4 w-4" /> Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TemplatesTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Certificate Templates</h2>
          <p className="text-muted-foreground">
            Manage and customize your certificate designs
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Create Template
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderData.map((template) => (
          <TemplateCard key={template.title} data={template} />
        ))}
      </div>
    </div>
  );
}

function TemplateCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-4 w-48" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function TemplatesTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
      </div>
    </div>
  );
}
