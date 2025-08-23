'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, getInitials } from '@/lib/utils';

interface ChannelLinkProps {
  name: string;
  imageUrl?: string;
  notificationCount?: number;
  isActive?: boolean;
}

export function ChannelLink({
  name,
  imageUrl,
  notificationCount = 0,
  isActive = false,
}: ChannelLinkProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group relative flex items-center justify-center">
            <div
              className={cn(
                'bg-foreground absolute left-0 h-2 w-1 rounded-r-full transition-all',
                isActive ? 'h-10' : 'h-2 group-hover:h-5'
              )}
            />

            <div
              className={cn(
                'bg-muted flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground rounded-2xl'
                  : 'group-hover:bg-muted/50 rounded-full group-hover:rounded-2xl'
              )}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">{getInitials(name)}</span>
              )}
            </div>

            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {notificationCount}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ChannelLinkSkeleton() {
  return (
    <div className="relative flex items-center justify-center">
      <Skeleton className="absolute left-0 h-10 w-1 rounded-r-full" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
}
