import { Skeleton } from '@/components/ui/skeleton';
import { communicationTabs } from '@/config/nav-items';
import { Suspense } from 'react';
import {
  DashboardHeader,
  DashboardHeaderSkeleton,
} from '../../_components/dashboard-header';
import { CommunicationTabs } from './_components/communication-tabs';
import { MessagesPageSkeleton } from './messages/mesage-page';

export function CommunicationPageSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardHeaderSkeleton />
      <div className="space-y-4">
        <div className="flex border-b">
          {Array.from({ length: communicationTabs.length }).map((_, index) => (
            <Skeleton key={index} className="h-10 flex-1" />
          ))}
        </div>
        <MessagesPageSkeleton />
      </div>
    </div>
  );
}

export default function CommunicationPage() {
  return (
    <div className="space-y-2">
      <DashboardHeader
        title="Communication Hub"
        description="Manage all student and course-related communication from one place."
      />

      <Suspense fallback={<CommunicationPageSkeleton />}>
        <CommunicationTabs />
      </Suspense>
    </div>
  );
}
