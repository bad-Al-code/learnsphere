'use client';

import { Card } from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useState } from 'react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessage';
import { Conversation } from '../types';
import { ChatView, ChatViewSkeleton } from './chat-view/ChatView';
import {
  ConversationList,
  ConversationListSkeleton,
} from './conversation-list/ConversationList';

export function ChatInterface() {
  const { data: conversations, isLoading: isLoadingConversations } =
    useConversations();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const { sendMessage } = useChatWebSocket();

  // useEffect(() => {
  //   if (conversations && conversations.length > 0 && !selectedConversation) {
  //     setSelectedConversation(conversations[0]);
  //   }
  // }, [conversations, selectedConversation]);

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    selectedConversation?.id || null
  );

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
    setSelectedConversation(newConversation);
  };

  return (
    <Card className="h-[calc(100vh-4rem)] w-full overflow-hidden pt-2 pb-0 lg:h-[calc(93vh)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={0} maxSize={100}>
          <ConversationList
            conversations={conversations || []}
            selectedId={selectedConversation?.id || null}
            onSelect={setSelectedConversation}
            onConversationCreated={handleConversationCreated}
            isLoading={isLoadingConversations}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatView
            user={selectedConversation?.otherParticipant || null}
            messages={messages}
            sendMessage={handleSendMessage}
            isLoading={isLoadingMessages && messages.length === 0}
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
