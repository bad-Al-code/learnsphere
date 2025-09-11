'use client';

import { Card } from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useEffect, useMemo, useState } from 'react';
import { markConversationAsRead } from '../api/chat.api';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import { Conversation, Message } from '../types';
import { ChatView, ChatViewSkeleton } from './chat-view/ChatView';
import {
  ConversationList,
  ConversationListSkeleton,
} from './conversation-list/ConversationList';

export function ChatInterface() {
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    isError: conversationLoadingError,
  } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId || !conversations) {
      // if (conversations && conversations.length > 0) {
      //   setSelectedConversationId(conversations[0].id);
      //   return conversations[0];
      // }

      return null;
    }

    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const { sendEvent } = useChatWebSocket(selectedConversation?.id || null);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: chatViewError,
  } = useMessages(selectedConversation?.id || null);

  const messages = messagesData?.pages.flat().reverse() || [];

  const handleSendMessage = (content: string, replyingToMessageId?: string) => {
    if (selectedConversation) {
      sendEvent({
        type: 'DIRECT_MESSAGE',
        payload: {
          conversationId: selectedConversation.id,
          content,
          replyingToMessageId,
        },
      });

      setReplyingTo(null);
    }
  };

  const handleConversationCreated = (newConversation: Conversation) => {
    setSelectedConversationId(newConversation.id);
  };

  const handleTyping = (isTyping: boolean) => {
    if (selectedConversation) {
      sendEvent({
        type: isTyping ? 'TYPING_START' : 'TYPING_STOP',
        payload: { conversationId: selectedConversation.id },
      });
    }
  };

  const handleSelectConversation = (convo: Conversation) => {
    setReplyingTo(null);
    setSelectedConversationId(convo.id);
  };

  useEffect(() => {
    if (selectedConversation?.id) {
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  return (
    <Card className="h-[calc(100vh-4.5rem)] w-full overflow-hidden pt-2 pb-0 lg:h-[calc(100vh-4.5rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={0} maxSize={100}>
          <ConversationList
            conversations={conversations || []}
            selectedId={selectedConversation?.id || null}
            onSelect={handleSelectConversation}
            onConversationCreated={handleConversationCreated}
            isLoading={isLoadingConversations}
            isError={conversationLoadingError}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatView
            conversation={selectedConversation}
            messages={messages}
            onSend={handleSendMessage}
            onTyping={handleTyping}
            isLoading={isLoadingMessages && messages.length === 0}
            isError={chatViewError}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}

export function ChatInterfaceSkeleton() {
  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={25} maxSize={100}>
          <ConversationListSkeleton />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ChatViewSkeleton />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
}
