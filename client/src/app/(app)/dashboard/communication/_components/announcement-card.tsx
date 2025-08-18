'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Paperclip,
  TrendingUp,
} from 'lucide-react';

type AnnouncementStatus = 'Sent' | 'Draft';
type AnnouncementCategory = 'course-update' | 'deadline' | 'schedule';

export interface Announcement {
  title: string;
  category: AnnouncementCategory;
  status: AnnouncementStatus;
  to: string;
  timestamp: string;
  body: string;
  views?: number;
  engagement?: number;
  attachments?: number;
}

interface AnnouncementCardProps {
  data: Announcement;
}

const getCategoryVariant = (
  category: AnnouncementCategory
): 'destructive' | 'secondary' => {
  return category === 'deadline' ? 'destructive' : 'secondary';
};

const StatusBadge = ({ status }: { status: AnnouncementStatus }) => {
  if (status === 'Draft') {
    return (
      <Badge variant="outline">
        <Clock className="mr-1.5 h-3.5 w-3.5" />
        Draft
      </Badge>
    );
  }
  return (
    <Badge variant="default">
      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
      Sent
    </Badge>
  );
};

export function AnnouncementCard({ data }: AnnouncementCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{data.title}</CardTitle>
              <Badge variant={getCategoryVariant(data.category)}>
                {data.category}
              </Badge>
            </div>
            <CardDescription className="hidden sm:block">
              To: {data.to} • {data.timestamp}
            </CardDescription>
          </div>
          <CardAction>
            <StatusBadge status={data.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{data.body}</p>
        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
          <TooltipProvider>
            {data.views !== undefined && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {data.views} <span className="hidden sm:inline">views</span>
                </TooltipTrigger>
                <TooltipContent>{data.views} views</TooltipContent>
              </Tooltip>
            )}
            {data.engagement !== undefined && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  {data.engagement}%{' '}
                  <span className="hidden sm:inline">engagement</span>
                </TooltipTrigger>
                <TooltipContent>{data.engagement}% engagement</TooltipContent>
              </Tooltip>
            )}
            {data.attachments !== undefined && data.attachments > 0 && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1.5">
                  <Paperclip className="h-4 w-4" />
                  {data.attachments}{' '}
                  <span className="hidden sm:inline">attachment(s)</span>
                </TooltipTrigger>
                <TooltipContent>
                  {data.attachments} attachment(s)
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-40 sm:w-56" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="hidden h-4 w-48 sm:block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-5 w-16 sm:w-24" />
          <Skeleton className="h-5 w-20 sm:w-28" />
          <Skeleton className="h-5 w-24 sm:w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
