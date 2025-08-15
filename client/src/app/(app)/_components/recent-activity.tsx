'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BellRing,
  BookUser,
  MessageSquare,
  Star,
  UserPlus,
} from 'lucide-react';

// NOTE: Placeholder data
const activities = [
  {
    type: 'enrollment',
    text: 'New student enrolled in Data Science',
    time: '2 hours ago',
    icon: UserPlus,
    user: { name: 'Alex Johnson', image: 'https://github.com/shadcn.png' },
  },
  {
    type: 'submission',
    text: 'Assignment submitted by Sarah Chen',
    time: '4 hours ago',
    icon: BookUser,
    user: { name: 'Sarah Chen', image: 'https://github.com/shadcn.png' },
  },
  {
    type: 'message',
    text: 'New message from a student',
    time: '6 hours ago',
    icon: MessageSquare,
    user: { name: 'Michael Rodriguez', image: 'https://github.com/shadcn.png' },
  },
  {
    type: 'review',
    text: 'Course review received (5 stars)',
    time: '1 day ago',
    icon: Star,
    user: { name: 'Emma Thompson', image: 'https://github.com/shadcn.png' },
  },
  {
    type: 'reminder',
    text: 'Assignment deadline reminder sent',
    time: '1 day ago',
    icon: BellRing,
    user: { name: 'System', image: '' },
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your courses</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="mt-1 h-8 w-8">
                <AvatarImage src={activity.user.image} />
                <AvatarFallback>
                  {activity.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user.name}</span>{' '}
                  {activity.text.replace(
                    /.+ (enrolled|submitted|from|received|sent)/,
                    ''
                  )}
                </p>
                <p className="text-muted-foreground text-xs">{activity.time}</p>
              </div>
              <activity.icon className="text-muted-foreground h-5 w-5 flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" /> 
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="mt-1 h-8 w-8 rounded-full" /> 
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" /> 
                <Skeleton className="h-3 w-24" /> 
              </div>
              <Skeleton className="h-5 w-5 rounded" /> 
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}