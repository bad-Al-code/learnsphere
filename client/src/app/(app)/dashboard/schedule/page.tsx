import { Suspense } from 'react';

import {
  QuickActions,
  QuickActionsSkeleton,
} from './_components/quick-actions';
import {
  CalendarHeader,
  CalendarHeaderSkeleton,
} from './_components/schedule-header';
import {
  UpcomingDeadlines,
  UpcomingDeadlinesSkeleton,
} from './_components/upcoming-deadline';
import {
  UpcomingEvents,
  UpcomingEventsSkeleton,
} from './_components/upcoming-events';

export default async function CalendarPage() {
  return (
    <div className="space-y-2">
      <Suspense fallback={<CalendarHeaderSkeleton />}>
        <CalendarHeader />
      </Suspense>

      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3 lg:gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Suspense fallback={<UpcomingEventsSkeleton />}>
            <UpcomingEvents />
          </Suspense>
        </div>

        <div className="col-span-1 space-y-2">
          <Suspense fallback={<UpcomingDeadlinesSkeleton />}>
            <UpcomingDeadlines />
          </Suspense>
          <Suspense fallback={<QuickActionsSkeleton />}>
            <QuickActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
