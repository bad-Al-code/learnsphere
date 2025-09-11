'use client';

import { cn } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { useState } from 'react';
import { Conversation, Message } from '../../types';
import { ChatHeader, ChatHeaderSkeleton } from './ChatHeader';
import { MessageInput, MessageInputSkeleton } from './MessageInput';
import { MessageList, MessageListSkeleton } from './MessageList';
import { ParticipantSidebar } from './ParticipantSidebar';
import { ReplyPreview } from './ReplyPreview';

interface ChatViewProps {
  conversation: Conversation | null;
  messages: Message[];
  onSend: (content: string, replyingToMessage?: Message | null) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  isError: boolean;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

export function ChatView({
  messages,
  conversation,
  onSend,
  onTyping,
  isLoading,
  isError,
  replyingTo,
  setReplyingTo,
  onReaction,
}: ChatViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = useSessionStore((state) => state.user);

  if (isLoading) {
    return <ChatViewSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Error Loading Messages</p>
      </div>
    );
  }

  const user = conversation?.otherParticipant;
  const isGroup = conversation?.type === 'group';

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex h-full flex-1 flex-col">
        <div
          onClick={() => isGroup && setIsSidebarOpen(true)}
          className={cn(isGroup && 'cursor-pointer')}
        >
          <ChatHeader
            conversation={conversation}
            typingUser={conversation.typingUser}
          />
        </div>
        <MessageList
          messages={messages}
          conversationType={conversation.type}
          onSetReply={setReplyingTo}
          onReaction={onReaction}
        />

        {replyingTo && (
          <ReplyPreview
            message={replyingTo}
            onCancel={() => setReplyingTo(null)}
          />
        )}

        <MessageInput
          recipientName={
            conversation.name || conversation.otherParticipant?.name || 'user'
          }
          conversationId={conversation.id}
          senderId={user.id}
          onSend={(content) => onSend(content, replyingTo)}
          onTyping={onTyping}
        />
      </div>

      {isGroup && isSidebarOpen && (
        <div className="w-64">
          <ParticipantSidebar
            conversationId={conversation!.id}
            onClose={() => setIsSidebarOpen(false)}
            createdById={conversation.createdById}
            currentUserId={currentUser!.userId}
          />
        </div>
      )}
    </div>
  );
}

export function ChatViewSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <ChatHeaderSkeleton />
      <MessageListSkeleton />
      <MessageInputSkeleton />
    </div>
  );
}
