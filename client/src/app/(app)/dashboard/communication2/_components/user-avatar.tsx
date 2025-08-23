'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';

type UserStatus = 'online' | 'away' | 'dnd' | 'offline';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  status?: UserStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({
  name,
  imageUrl,
  status = 'offline',
  size = 'md',
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };
  const statusClasses: Record<UserStatus, string> = {
    online: 'bg-green-500',
    away: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-muted',
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      {status !== 'offline' && (
        <span
          className={cn(
            'border-muted absolute right-0 bottom-0 block h-3 w-3 rounded-full border-2',
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
}

export function UserAvatarSkeleton({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };
  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
}
