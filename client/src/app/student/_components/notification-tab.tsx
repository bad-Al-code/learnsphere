'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Bell,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type TNotificationCategory = 'assignments' | 'courses' | 'platform' | 'message';

type TNotification = {
  id: string;
  title: string;
  description: string;
  category: TNotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionButtonText?: string;
};

type TNotificationItemProps = {
  notification: TNotification;
  onMarkAsRead: (id: string) => void;
};

const initialNotifications: TNotification[] = [
  {
    id: '1',
    title: 'New assignment posted: Database Optimization',
    description: 'Due in 5 days - Database Design course',
    category: 'assignments',
    timestamp: '2h ago',
    isRead: false,
    actionButtonText: 'View Assignment',
  },
  {
    id: '2',
    title: 'New module available: Advanced React Patterns',
    description: 'React Fundamentals course has been updated',
    category: 'courses',
    timestamp: '1d ago',
    isRead: false,
    actionButtonText: 'Start Module',
  },
  {
    id: '3',
    title: 'System maintenance scheduled',
    description: 'Platform will be unavailable on Jan 15, 2-4 AM',
    category: 'platform',
    timestamp: '2d ago',
    isRead: true,
  },
  {
    id: '4',
    title: 'Grade released: React Component Project',
    description: 'You scored 94% - Great work!',
    category: 'assignments',
    timestamp: '3d ago',
    isRead: true,
    actionButtonText: 'View Feedback',
  },
  {
    id: '5',
    title: 'Instructor message: Office hours reminder',
    description: 'Sarah Chen - Available Tuesdays 2-4 PM',
    category: 'message',
    timestamp: '1w ago',
    isRead: true,
  },
];

export function NotificationItem({
  notification,
  onMarkAsRead,
}: TNotificationItemProps) {
  const categoryIcons: Record<TNotificationCategory, LucideIcon> = {
    assignments: FileText,
    courses: BookOpen,
    platform: Clock,
    message: MessageSquare,
  };
  const Icon = categoryIcons[notification.category];

  return (
    <div
      className={cn(
        'relative flex items-center justify-between rounded-lg border p-4 transition-colors',
        !notification.isRead
          ? 'border-red-500/20 bg-red-900/10'
          : 'border-transparent'
      )}
    >
      {!notification.isRead && (
        <div className="absolute top-0 left-0 h-full w-1 rounded-l-md bg-red-500" />
      )}
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground mt-1">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold">{notification.title}</p>
          <p className="text-muted-foreground text-sm">
            {notification.description}
          </p>

          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <Badge variant="outline" className="capitalize">
              {notification.category}
            </Badge>
            <span>{notification.timestamp}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center pl-4">
        {notification.actionButtonText && (
          <Button variant="outline" size="sm">
            {notification.actionButtonText}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMarkAsRead(notification.id)}
          disabled={notification.isRead}
        >
          <CheckCircle2
            className={cn(
              'h-5 w-5 transition-colors',
              notification.isRead
                ? 'text-green-500'
                : 'text-muted-foreground hover:text-primary'
            )}
          />
        </Button>
      </div>
    </div>
  );
}

export function NotificationTab() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<
    TNotificationCategory | 'all'
  >('all');

  function handleMarkAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n) => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const FILTERS: (TNotificationCategory | 'all')[] = [
    'all',
    'assignments',
    'courses',
    'platform',
  ];

  return (
    <Card className="">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? 'secondary' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          ) : (
            <div className="text-muted-foreground py-16 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12" />
              <p>No notifications for this category.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex w-full items-start gap-4">
        <Skeleton className="mt-1 h-6 w-6 rounded-full" />
        <div className="flex w-full flex-col space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 pl-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}

export function NotificationTabSkeleton() {
  return (
    <Card className="">
      <CardHeader className="flex-row items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-36" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2">
          <NotificationItemSkeleton />
          <NotificationItemSkeleton />
          <NotificationItemSkeleton />
          <NotificationItemSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}
