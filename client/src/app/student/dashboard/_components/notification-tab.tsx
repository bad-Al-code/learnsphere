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
import { useWebSocket } from '@/hooks/use-web-socket';
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
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from '../hooks/use-notification';
import { Notification } from '../schema/notification.schema';

type TNotificationItemProps = {
  notification: Notification;
};

const categoryIcons: Record<string, LucideIcon> = {
  assignments: FileText,
  courses: BookOpen,
  platform: Clock,
  message: MessageSquare,
  default: Bell,
};

export function NotificationItem({ notification }: TNotificationItemProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();
  const Icon =
    categoryIcons[notification.type.toLowerCase()] || categoryIcons.default;

  return (
    <div
      className={cn(
        'relative flex items-center justify-between rounded-lg border p-4 transition-colors',
        !notification.isRead && 'border-primary/20 bg-primary/10'
      )}
    >
      {!notification.isRead && (
        <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-l-md" />
      )}
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground mt-1">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold">{notification.content}</p>
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <Badge variant="outline" className="capitalize">
              {notification.type.replace(/_/g, ' ')}
            </Badge>
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center pl-4">
        {notification.linkUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={notification.linkUrl}>View</a>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => markAsRead(notification.id)}
          disabled={notification.isRead || isPending}
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
  useWebSocket(true);
  const { data: notifications, isLoading, isError } = useNotifications();
  const { mutate: markAllRead } = useMarkAllAsRead();

  if (isLoading) return <NotificationTabSkeleton />;

  if (isError)
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center">
          Failed to load notifications.
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" onClick={() => markAllRead()}>
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: Notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="text-muted-foreground py-16 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12" />
              <p>You're all caught up!</p>
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
