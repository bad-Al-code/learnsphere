export type ConversationParticipant = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
};

export type Conversation = {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  lastMessage: string | null;
  lastMessageTimestamp: string | null;
  otherParticipant: ConversationParticipant | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
};
