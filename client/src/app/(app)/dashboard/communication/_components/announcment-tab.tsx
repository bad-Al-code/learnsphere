'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BellPlus } from 'lucide-react';
import {
  Announcement,
  AnnouncementCard,
  AnnouncementCardSkeleton,
} from './announcement-card';

const placeholderAnnouncements: Announcement[] = [
  {
    title: 'New Course Material Available',
    category: 'course-update',
    status: 'Sent',
    to: 'Data Science Students',
    timestamp: '3 hours ago',
    body: 'Week 5 materials for Data Science course have been uploaded. Please review before next class.',
    views: 45,
    engagement: 78,
    attachments: 1,
  },
  {
    title: 'Assignment Deadline Reminder',
    category: 'deadline',
    status: 'Sent',
    to: 'All Students',
    timestamp: '1 day ago',
    body: 'Reminder: Assignment 4 is due this Friday at 11:59 PM. Please submit through the course portal.',
    views: 120,
    engagement: 92,
  },
  {
    title: 'Office Hours Update',
    category: 'schedule',
    status: 'Draft',
    to: 'All Students',
    timestamp: '2 days ago',
    body: 'Office hours for this week have been moved to Thursday 2-4 PM due to scheduling conflicts.',
  },
];

interface AnnouncementsProps {
  data?: Announcement[];
}

export function Announcements({
  data = placeholderAnnouncements,
}: AnnouncementsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Button>
          <BellPlus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>
      <div className="space-y-4">
        {data.map((announcement) => (
          <AnnouncementCard key={announcement.title} data={announcement} />
        ))}
      </div>
    </div>
  );
}

export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <AnnouncementCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
