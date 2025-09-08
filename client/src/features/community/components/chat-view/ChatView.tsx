'use client';

import { Conversation, Message } from '../../types';
import { ChatHeader, ChatHeaderSkeleton } from './ChatHeader';
import { MessageInput, MessageInputSkeleton } from './MessageInput';
import { MessageList, MessageListSkeleton } from './MessageList';

interface ChatViewProps {
  user: Conversation['otherParticipant'];
  messages: Message[];
  sendMessage: (content: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export function ChatView({
  user,
  messages,
  sendMessage,
  isLoading,
  isError,
}: ChatViewProps) {
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

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader user={user} />
      <MessageList messages={messages} />
      <MessageInput
        recipientName={user.name || 'user'}
        sendMessage={sendMessage}
      />
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
