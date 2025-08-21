export type MessagePriority = 'normal' | 'high';

export interface Message {
  id: number;
  sender: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  subject: string;
  snippet: string;
  body: string;
  course: string;
  priority: MessagePriority;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
}
