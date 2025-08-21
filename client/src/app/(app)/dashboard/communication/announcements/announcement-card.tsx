import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Paperclip,
  TrendingUp,
} from 'lucide-react';
import { Announcement, AnnouncementTag } from './types';

const tagColors: Record<AnnouncementTag, string> = {
  'course-update': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  deadline: 'bg-red-100 text-red-800 hover:bg-red-100',
  schedule: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  const isSent = announcement.status === 'Sent';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{announcement.title}</h3>
            <Badge className={cn(tagColors[announcement.tag])}>
              {announcement.tag.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {announcement.recipient} • {announcement.timestamp}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isSent ? 'default' : 'secondary'}>
            {isSent ? (
              <CheckCircle className="mr-1 h-3 w-3" />
            ) : (
              <Clock className="mr-1 h-3 w-3" />
            )}
            {announcement.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{announcement.body}</p>
      </CardContent>
      <CardFooter className="text-muted-foreground flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" /> {announcement.stats.views} views
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4" /> {announcement.stats.engagement}%
          engagement
        </div>
        {announcement.stats.attachments > 0 && (
          <div className="flex items-center gap-1.5">
            <Paperclip className="h-4 w-4" /> {announcement.stats.attachments}{' '}
            attachment(s)
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex items-center gap-6">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
