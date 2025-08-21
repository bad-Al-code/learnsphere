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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, PenSquare, Plus } from 'lucide-react';
import {
  CertificateElegant,
  ClassicTemplate,
  ElegantTemplate,
  ModernTemplate,
} from './certificate-template';

interface TemplateData {
  title: string;
  description: string;
  isDefault?: boolean;
  component: React.FC<any>;
}
const placeholderData: TemplateData[] = [
  {
    title: 'Elegant Certificate 1',
    description: 'Modern Design with adaptivve themes',
    component: CertificateElegant,
    isDefault: true,
  },
  {
    title: 'Classic Certificate',
    description: 'Traditional formal certificate design',
    component: ClassicTemplate,
  },
  {
    title: 'Modern Certificate',
    description: 'Clean, contemporary design',
    component: ModernTemplate,
  },
  {
    title: 'Elegant Certificate 2',
    description: 'Sophisticated design with decorative elements',
    component: ElegantTemplate,
  },
];

function TemplateCard({ data }: { data: TemplateData }) {
  const TemplateComponent = data.component;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex h-[225px] w-full items-center justify-center overflow-hidden rounded-md border bg-gray-100">
          <div className="aspect-[4/3] origin-center scale-[0.25]">
            <TemplateComponent />
          </div>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Eye className="h-4 w-4" /> Preview
            </Button>
          </DialogTrigger>
          <DialogTitle></DialogTitle>
          <DialogContent className="mx-auto min-h-screen min-w-screen p-0">
            <div className="bg-background flex items-center justify-center overflow-auto p-2">
              <TemplateComponent />
            </div>
          </DialogContent>
        </Dialog>

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
