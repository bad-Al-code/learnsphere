'use client';

import { Conversation, Message } from '../../types';
import { ChatHeader, ChatHeaderSkeleton } from './ChatHeader';
import { MessageInput, MessageInputSkeleton } from './MessageInput';
import { MessageList, MessageListSkeleton } from './MessageList';

interface ChatViewProps {
  conversation: Conversation | null;
  messages: Message[];
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  isError: boolean;
}

export function ChatView({
  messages,
  conversation,
  onSend,
  onTyping,
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

  const user = conversation?.otherParticipant;
  const typingUser = conversation?.typingUser;

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader user={user} typingUser={typingUser} />
      <MessageList messages={messages} />
      <MessageInput
        recipientName={user.name || 'user'}
        onSend={onSend}
        onTyping={onTyping}
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
