'use client';

import { Conversation } from '../../types';
import { ConversationItem, ConversationItemSkeleton } from './ConversationItem';
import {
  ConversationListHeader,
  ConversationListHeaderSkeleton,
} from './ConversationListHeader';
interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onConversationCreated: (conversation: Conversation) => void;
  isLoading: boolean;
  isError: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onConversationCreated,
  isLoading,
  isError,
}: ConversationListProps) {
  if (isLoading) {
    return <ConversationListSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-destructive p-4">Failed to load conversations.</p>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <ConversationListHeader onConversationCreated={onConversationCreated} />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((convo) => (
            <ConversationItem
              key={convo.id}
              conversation={convo}
              isSelected={convo.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="p-2">
      <ConversationListHeaderSkeleton />

      <div className="mt-4 space-y-1 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
