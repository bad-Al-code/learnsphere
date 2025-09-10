'use client';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Conversation } from '../../types';
import { NewGroupDialog } from './NewGroupDialog';
import { NewMessageDialog } from './NewMessageDialog';

interface ConversationListHeaderProps {
  onConversationCreated: (conversation: Conversation) => void;
}

export function ConversationListHeader({
  onConversationCreated,
}: ConversationListHeaderProps) {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Direct Messages</h2>
        <div className="flex items-center">
          <NewGroupDialog onConversationCreated={onConversationCreated} />
          <NewMessageDialog onConversationCreated={onConversationCreated} />
        </div>
      </div>

      <div className="relative mt-4">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search conversations..." className="pl-9" />
      </div>
    </div>
  );
}

export function ConversationListHeaderSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}
