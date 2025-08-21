import { Skeleton } from '@/components/ui/skeleton';

export function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="mt-1 h-5 w-[400px]" />
    </div>
  );
}
