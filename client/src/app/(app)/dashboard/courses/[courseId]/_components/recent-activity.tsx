import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  data: {
    user: { name: string; image: string };
    action: string;
    timestamp: Date;
  }[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={item.user.image} alt={item.user.name} />
                <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-none font-medium">
                  {item.user.name}
                </p>
                <p className="text-muted-foreground text-sm">{item.action}</p>
              </div>
              <p className="text-muted-foreground text-sm">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </p>
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
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
