'use client';

import { Card } from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useMemo, useState } from 'react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import { Conversation } from '../types';
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
  const { sendMessage } = useChatWebSocket();

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

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: chatViewError,
  } = useMessages(selectedConversation?.id || null);

  const messages = messagesData?.pages.flat().reverse() || [];

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      sendMessage({
        conversationId: selectedConversation.id,
        content: content,
      });
    }
  };

  const handleConversationCreated = (newConversation: Conversation) => {
    setSelectedConversationId(newConversation.id);
  };

  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pt-2 pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={0} maxSize={100}>
          <ConversationList
            conversations={conversations || []}
            selectedId={selectedConversation?.id || null}
            onSelect={(convo) => setSelectedConversationId(convo.id)}
            onConversationCreated={handleConversationCreated}
            isLoading={isLoadingConversations}
            isError={conversationLoadingError}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatView
            user={selectedConversation?.otherParticipant || null}
            messages={messages}
            sendMessage={handleSendMessage}
            isLoading={isLoadingMessages && messages.length === 0}
            isError={chatViewError}
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
