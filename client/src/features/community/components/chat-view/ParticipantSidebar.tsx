'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import { X } from 'lucide-react';
import { useParticipants } from '../../hooks/useParticipants';

interface ParticipantSidebarProps {
  conversationId: string;
  onClose: () => void;
}

export function ParticipantSidebar({
  conversationId,
  onClose,
}: ParticipantSidebarProps) {
  const { data: participants, isLoading } = useParticipants(conversationId);

  return (
    <div className="bg-background flex h-full flex-col border-l">
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="font-semibold">Members</h3>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <ParticipantSkeleton key={i} />
          ))}

        {participants?.map((p) => (
          <div
            key={p.userId}
            className="hover:bg-muted flex items-center gap-2 rounded-md p-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={p.user.avatarUrl || undefined} />
              <AvatarFallback>{getInitials(p.user.name)}</AvatarFallback>
            </Avatar>

            <span className="font-medium">{p.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParticipantSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}
