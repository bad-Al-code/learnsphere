'use client';

import { Conversation, Message } from '../../types';
import { ChatHeader, ChatHeaderSkeleton } from './ChatHeader';
import { MessageInput, MessageInputSkeleton } from './MessageInput';
import { MessageList, MessageListSkeleton } from './MessageList';
import { ReplyPreview } from './ReplyPreview';

interface ChatViewProps {
  conversation: Conversation | null;
  messages: Message[];
  onSend: (content: string, replyingToMessageId?: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  isError: boolean;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
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

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        conversation={conversation}
        typingUser={conversation.typingUser}
      />
      <MessageList
        messages={messages}
        conversationType={conversation.type}
        onSetReply={setReplyingTo}
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
