import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CreateEventForm } from './create-event-form';

export async function CalendarHeader() {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(2000);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="flex-1 text-center font-semibold sm:flex-none">
        Friday, August 15, 2025
      </span>
      <Button variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <CreateEventForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CalendarHeaderSkeleton() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-10" />
      <Skeleton className="ml-4 h-10 w-32" />
    </div>
  );
}
