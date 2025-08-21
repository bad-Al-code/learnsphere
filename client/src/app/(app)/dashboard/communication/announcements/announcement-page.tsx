import {
  AnnouncementCard,
  AnnouncementCardSkeleton,
} from './announcement-card';
import {
  AnnouncementsHeader,
  AnnouncementsHeaderSkeleton,
} from './announcements-header';
import { Announcement } from './types';

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'New Course Material Available',
    tag: 'course-update',
    status: 'Sent',
    recipient: 'To: Data Science Students',
    timestamp: '3 hours ago',
    body: 'Week 5 materials for Data Science course have been uploaded. Please review before next class.',
    stats: { views: 45, engagement: 78, attachments: 1 },
  },
  {
    id: 2,
    title: 'Assignment Deadline Reminder',
    tag: 'deadline',
    status: 'Sent',
    recipient: 'To: All Students',
    timestamp: '1 day ago',
    body: 'Reminder: Assignment 4 is due this Friday at 11:59 PM. Please submit through the course portal.',
    stats: { views: 120, engagement: 92, attachments: 0 },
  },
  {
    id: 3,
    title: 'Office Hours Update',
    tag: 'schedule',
    status: 'Draft',
    recipient: 'To: All Students',
    timestamp: '2 days ago',
    body: 'Office hours for this week have been moved to Thursday 2-4 PM due to scheduling conflicts.',
    stats: { views: 0, engagement: 0, attachments: 0 },
  },
];

export function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <AnnouncementsHeader />
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}

export function AnnouncementsPageSkeleton() {
  return (
    <div className="space-y-6">
      <AnnouncementsHeaderSkeleton />
      <div className="space-y-4">
        <AnnouncementCardSkeleton />
        <AnnouncementCardSkeleton />
        <AnnouncementCardSkeleton />
      </div>
    </div>
  );
}
