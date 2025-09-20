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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Shield,
  Trash2,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from '../hooks/use-notification';
import { Notification } from '../schema/notification.schema';

type TNotificationItemProps = {
  notification: Notification;
  onDelete?: (id: string) => void;
};

type FilterOption = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const categoryIcons: Record<string, LucideIcon> = {
  assignments: FileText,
  courses: BookOpen,
  platform: Clock,
  message: MessageSquare,
  security_alert: Shield,
  welcome: UserPlus,
  application_status: Bell,
  default: Bell,
};

const categoryColors: Record<string, string> = {
  assignments: 'text-blue-500 bg-blue-500/10',
  courses: 'text-green-500 bg-green-500/10',
  platform: 'text-orange-500 bg-orange-500/10',
  message: 'text-purple-500 bg-purple-500/10',
  security_alert: 'text-red-500 bg-red-500/10',
  welcome: 'text-emerald-500 bg-emerald-500/10',
  application_status: 'text-yellow-500 bg-yellow-500/10',
  default: 'text-gray-500 bg-gray-500/10',
};

export function NotificationItem({
  notification,
  onDelete,
}: TNotificationItemProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();
  const [isDeleting, setIsDeleting] = useState(false);

  const normalizedType = notification.type.toLowerCase().replace(/_/g, '_');
  const Icon = categoryIcons[normalizedType] || categoryIcons.default;
  const colorClasses = categoryColors[normalizedType] || categoryColors.default;

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(notification.id);
      }, 200);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border',
        !notification.isRead
          ? 'border-l-primary bg-primary/5 border-l-4 shadow-sm'
          : 'border-transparent',
        isDeleting && 'translate-x-full scale-95 opacity-0'
      )}
    >
      <div className="flex items-center justify-between rounded-xl border p-6">
        <div className="flex flex-1 items-start gap-4">
          <div
            className={cn('rounded-xl p-2.5 transition-colors', colorClasses)}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3
                className={cn(
                  'text-sm leading-tight font-semibold',
                  !notification.isRead && 'text-foreground',
                  notification.isRead && 'text-muted-foreground'
                )}
              >
                {notification.content}
              </h3>

              {!notification.isRead && (
                <div className="bg-primary h-2 w-2 flex-shrink-0 animate-pulse rounded-full" />
              )}
            </div>

            <div className="mt-1 flex items-center gap-3">
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium capitalize',
                  colorClasses.split(' ')[0]
                )}
              >
                {notification.type.replace(/_/g, ' ')}
              </Badge>

              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {formatTimestamp(notification.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0">
          {notification.linkUrl && (
            <Button variant="outline" size="sm" asChild className="">
              <a
                href={notification.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
                disabled={notification.isRead || isPending}
                className="transition-transform hover:scale-110"
              >
                <CheckCircle2
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    notification.isRead
                      ? 'text-green-500'
                      : 'text-muted-foreground hover:text-green-500'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!notification.isRead || isPending} Mark as Read
            </TooltipContent>
          </Tooltip>

          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationTab() {
  useWebSocket(true);
  const { data: notifications, isLoading, isError } = useNotifications();
  const { mutate: markAllRead } = useMarkAllAsRead();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [hiddenNotifications, setHiddenNotifications] = useState<Set<string>>(
    new Set()
  );

  const handleOptimisticDelete = (id: string) => {
    setHiddenNotifications((prev) => new Set([...prev, id]));
  };

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    let filtered = (notifications as Notification[]).filter(
      (n: Notification) => !hiddenNotifications.has(n.id)
    );

    if (activeFilter === 'all') return filtered;
    if (activeFilter === 'unread')
      return filtered.filter((n: Notification) => !n.isRead);

    return filtered.filter(
      (n: Notification) =>
        n.type.toLowerCase().replace(/_/g, '_') === activeFilter
    );
  }, [notifications, activeFilter, hiddenNotifications]);

  const unreadCount =
    notifications?.filter(
      (n: Notification) => !n.isRead && !hiddenNotifications.has(n.id)
    ).length || 0;

  const availableTypes = useMemo(() => {
    if (!notifications) return [];
    const types = [
      ...new Set(
        notifications.map((n: Notification) =>
          n.type.toLowerCase().replace(/_/g, '_')
        )
      ),
    ];
    return types;
  }, [notifications]);

  const FILTERS: FilterOption[] = useMemo(() => {
    const baseFilters: FilterOption[] = [
      { key: 'all', label: 'All', icon: Bell },
      { key: 'unread', label: 'Unread', icon: CheckCircle },
    ];

    const typeFilters: FilterOption[] = availableTypes.map((type: string) => ({
      key: type,
      label: type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      icon: categoryIcons[type] || categoryIcons.default,
    }));

    return [...baseFilters, ...typeFilters];
  }, [availableTypes]);

  if (isLoading) return <NotificationTabSkeleton />;

  if (isError) {
    return (
      <Card className="">
        <CardContent className="text-destructive py-16 text-center">
          <div className="bg-destructive/10 mx-auto mb-4 w-fit rounded-full p-4">
            <X className="text-destructive h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            Failed to load notifications
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-xl p-2">
              <Bell className="text-primary h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <p className="text-muted-foreground mt-1 text-sm">
                  You have {unreadCount} unread notification
                  {unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <CardAction className="">
            {unreadCount > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => markAllRead()}
                className=""
              >
                <CheckCircle className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {FILTERS.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {FILTERS.map((filter: FilterOption) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;

              let categoryCount = 0;
              if (filter.key === 'all') {
                categoryCount = filteredNotifications.length;
              } else if (filter.key === 'unread') {
                categoryCount = unreadCount;
              } else {
                categoryCount =
                  notifications?.filter(
                    (n: Notification) =>
                      n.type.toLowerCase().replace(/_/g, '_') === filter.key &&
                      !hiddenNotifications.has(n.id)
                  ).length || 0;
              }

              return (
                <Button
                  key={filter.key}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {filter.label}
                  {categoryCount > 0 && (
                    <Badge
                      variant={isActive ? 'secondary' : 'outline'}
                      className="ml-1 h-5 text-xs"
                    >
                      {categoryCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        <div className="space-y-2">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map(
                (notification: Notification, index: number) => (
                  <div key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      onDelete={handleOptimisticDelete}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="bg-muted/50 mx-auto mb-4 w-fit rounded-full p-4">
                <Bell className="text-muted-foreground h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
              <p className="text-muted-foreground">
                {activeFilter === 'all'
                  ? "You're all caught up! No notifications to show."
                  : `No ${activeFilter} notifications to show.`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="bg-card animate-pulse rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function NotificationTabSkeleton() {
  return (
    <Card className="">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="mt-2 h-4 w-60" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-md" />
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <NotificationItemSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
