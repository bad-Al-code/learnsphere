import { Skeleton } from '../ui/skeleton';

export function RichTextEditorSkeleton() {
  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
