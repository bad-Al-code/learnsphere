'use client';

import { useMarkAllRead, useNotifications } from '@/hooks/use-notifications';
import { Notification } from '@/lib/api/notification';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  BookOpen,
  Clock,
  FileText,
  LayoutTemplate,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const notificationConfig: Record<
  string,
  { icon: React.ElementType; color: string; tag: string }
> = {
  ASSIGNMENT_DUE: {
    icon: BookOpen,
    color: 'text-destructive',
    tag: 'assignment',
  },
  NEW_GRADE: { icon: Trophy, color: 'text-yellow-500', tag: 'grade' },
  COURSE_UPDATE: {
    icon: LayoutTemplate,
    color: 'text-green-500',
    tag: 'course',
  },
  REPORT_READY: {
    icon: FileText,
    color: 'text-blue-500',
    tag: 'report',
  },
  DEFAULT: { icon: Bell, color: 'text-foreground', tag: 'notification' },
};

const parseNotificationContent = (content: string) => {
  const parts = content.split(':');
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      description: parts.slice(1).join(':').trim(),
    };
  }
  return { title: content, description: '' };
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    recipientId: 'user-123',
    type: 'ASSIGNMENT_DUE',
    content: 'Assignment Due Soon: Database Design project due in 2 hours',
    isRead: false,
    linkUrl: '#',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    recipientId: 'user-123',
    type: 'NEW_GRADE',
    content: 'New Grade Posted: Web Development Quiz - 92%',
    isRead: false,
    linkUrl: '#',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    recipientId: 'user-123',
    type: 'COURSE_UPDATE',
    content: 'Course Update: New materials added to React',
    isRead: true,
    linkUrl: '#',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const NotificationItemSkeleton = () => (
  <div className="relative flex px-4 py-3">
    <div className="bg-muted absolute top-3 bottom-3 left-0 w-1 rounded-r-full" />
    <div className="ml-2 flex items-start gap-3">
      <Skeleton className="mt-1 h-5 w-5 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-2 flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export const NotificationLoadingState = () => (
  <div className="space-y-1">
    <NotificationItemSkeleton />
    <NotificationItemSkeleton />
    <NotificationItemSkeleton />
  </div>
);

export const NotificationEmptyState = () => (
  <p className="text-muted-foreground p-4 text-center text-sm">
    No new notifications.
  </p>
);

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export const NotificationHeader = ({
  unreadCount,
  onMarkAllRead,
}: NotificationHeaderProps) => (
  <DropdownMenuLabel className="flex items-center justify-between p-4 text-base font-bold">
    <div className="flex items-center gap-2">
      Notifications
      <div className="flex items-center gap-1.5 text-xs font-normal text-green-500">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        Live
      </div>
    </div>
    <Button
      variant="link"
      className="h-auto p-0 text-sm"
      onClick={onMarkAllRead}
      disabled={unreadCount === 0}
    >
      Mark all read
    </Button>
  </DropdownMenuLabel>
);

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const config =
    notificationConfig[notification.type] || notificationConfig.DEFAULT;
  const { title, description } = parseNotificationContent(notification.content);

  return (
    <DropdownMenuItem asChild className="focus:bg-secondary cursor-pointer p-0">
      <Link
        href={notification.linkUrl || '#'}
        className="relative block px-4 py-3"
      >
        {!notification.isRead && (
          <div className="bg-primary absolute top-3 bottom-3 left-0 w-1 rounded-r-full" />
        )}

        <div
          className={`flex items-start gap-3 ${!notification.isRead ? 'ml-2' : ''}`}
        >
          <config.icon
            className={`mt-1 h-5 w-5 flex-shrink-0 ${config.color}`}
          />
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-foreground text-sm font-semibold">{title}</p>
              {!notification.isRead && (
                <div className="bg-primary h-2 w-2 rounded-full" />
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-tight">
              {description}
            </p>
            <div className="mt-2 flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground/80 flex items-center gap-1.5 text-xs">
                    <Clock size={12} />
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(notification.createdAt).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="outline">{config.tag}</Badge>
            </div>
          </div>
        </div>
      </Link>
    </DropdownMenuItem>
  );
};

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList = ({ notifications }: NotificationListProps) => (
  <div className="max-h-[40vh] overflow-y-auto">
    {notifications.map((notification) => (
      <NotificationItem key={notification.id} notification={notification} />
    ))}
  </div>
);

export const NotificationFooter = () => (
  <div className="text-muted-foreground py-2 text-center text-xs">
    Last updated: Just now
  </div>
);

export function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications();
  // const { data: notifications, isLoading } = {
  //   data: mockNotifications,
  //   isLoading: false,
  // };
  const markAllReadMutation = useMarkAllRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const formattedUnreadCount = unreadCount > 9 ? '9+' : unreadCount;

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllReadMutation.mutate();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && unreadCount > 0) {
      handleMarkAllRead();
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold">
                      {formattedUnreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>

              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96">
          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllRead={handleMarkAllRead}
          />
          <DropdownMenuSeparator />
          {isLoading ? (
            <NotificationLoadingState />
          ) : !notifications || notifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <NotificationList notifications={notifications} />
          )}
          <DropdownMenuSeparator />
          <NotificationFooter />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
