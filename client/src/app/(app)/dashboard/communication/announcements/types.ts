export type AnnouncementTag = 'course-update' | 'deadline' | 'schedule';
export type AnnouncementStatus = 'Sent' | 'Draft';

export interface Announcement {
  id: number;
  title: string;
  tag: AnnouncementTag;
  status: AnnouncementStatus;
  recipient: string;
  timestamp: string;
  body: string;
  stats: {
    views: number;
    engagement: number;
    attachments: number;
  };
}
