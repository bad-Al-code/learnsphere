'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string | null;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-2 flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground line-clamp-2" title={description}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10" />
      <div>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
    </div>
  );
}
