import { z } from 'zod';

export const reactionSchema = z.object({
  emoji: z.enum(['Star', 'Heart', 'Sparkles']),
  count: z.number(),
  color: z.string(),
});

export const discussionSchema = z.object({
  id: z.uuid(),
  isStarred: z.boolean(),
  title: z.string(),
  author: z.string(),
  authorInitials: z.string(),
  role: z.string(),
  timestamp: z.iso.datetime(),
  content: z.string(),
  tags: z.array(z.string()).nullable(),
  upvotes: z.number(),
  downvotes: z.number(),
  replies: z.number(),
  reactions: z.array(reactionSchema),
});

export const discussionsResponseSchema = z.array(discussionSchema);
export type Discussion = z.infer<typeof discussionSchema>;
