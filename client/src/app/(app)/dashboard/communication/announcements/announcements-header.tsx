import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BellPlus } from 'lucide-react';

export function AnnouncementsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
      <Button>
        <BellPlus className="mr-2 h-4 w-4" />
        New Announcement
      </Button>
    </div>
  );
}

export function AnnouncementsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-60" />
      <Skeleton className="h-10 w-44" />
    </div>
  );
}
