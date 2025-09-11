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
import { useManageParticipants } from '../../hooks/useManageParticipants';
import { useParticipants } from '../../hooks/useParticipants';
import { AddParticipantDialog } from './AddParticipantDialog';

interface ParticipantSidebarProps {
  conversationId: string;
  createdById: string | null | undefined;
  currentUserId: string;
  onClose: () => void;
}

export function ParticipantSidebar({
  conversationId,
  createdById,
  currentUserId,
  onClose,
}: ParticipantSidebarProps) {
  const { data: participants, isLoading } = useParticipants(conversationId);
  const { removeParticipant, isRemoving } =
    useManageParticipants(conversationId);
  const { addParticipant, isAdding } = useManageParticipants(conversationId);

  const isCreator = currentUserId === createdById;

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

      {isCreator && (
        <div className="p-2">
          <AddParticipantDialog
            onAddParticipant={addParticipant}
            existingParticipantIds={participants?.map((p) => p.userId) || []}
          />
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <ParticipantSkeleton key={i} />
          ))}

        {participants?.map((p) => (
          <div
            key={p.userId}
            className="group hover:bg-muted flex items-center gap-2 rounded-md p-2"
          >
            <Avatar>
              <AvatarImage src={p.user.avatarUrl || undefined} />
              <AvatarFallback>{getInitials(p.user.name)}</AvatarFallback>
            </Avatar>

            <span className="font-medium">{p.user.name}</span>

            {isCreator && p.userId !== currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => removeParticipant(p.userId)}
                disabled={isRemoving}
              >
                <X className="text-destructive h-4 w-4" />
              </Button>
            )}
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
