export interface Requester {
  id: string;
  role: 'student' | 'instructor' | 'admin';
}

export type DiscussionWithEngagement = {
  id: string;
  isStarred: boolean | null;
  title: string | null;
  author: string | null;
  authorInitials: string;
  role: string;
  timestamp: Date | null;
  content: string | null;
  tags: string[] | null;
  upvotes: number;
  downvotes: number;
  stars: number;
  hearts: number;
  sparkles: number;
  replies: number;
  lastMessageTime: Date | null;
};

export interface PublicProfile {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  bio: string | null;
}
