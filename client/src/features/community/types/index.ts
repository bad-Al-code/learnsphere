export type ConversationParticipant = {
  id: string;
  status?: 'online' | 'offline';
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
  typingUser?: {
    name: string | null;
  };
  unreadCount: number | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
  replyingTo: {
    content: string;
    sender: {
      name: string | null;
    } | null;
  } | null;
  sender: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

export interface UserSearchResult {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrls?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  headline: string | null;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

export type MediaAttachment = {
  type: 'file' | 'image';
  url: string;
  name: string;
  mimeType: string;
};
