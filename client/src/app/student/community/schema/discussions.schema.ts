import { z } from 'zod';

export const ReactionEmojiEnum = z.enum(['Star', 'Heart', 'Sparkles']);
export const reactionSchema = z.object({
  emoji: ReactionEmojiEnum,
  count: z.number(),
  color: z.string(),
});
export type ReactionEmoji = z.infer<typeof ReactionEmojiEnum>;
export type Reaction = z.infer<typeof reactionSchema>;

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

export const reactionTypeSchema = z.enum([
  'like',
  'upvote',
  'downvote',
  'star',
  'heart',
  'sparkles',
]);
export type ReactionType = z.infer<typeof reactionTypeSchema>;

export const reactMessageInputSchema = z.object({
  messageId: z.uuid(),
  reaction: reactionTypeSchema,
});
export type ReactMessageInput = z.infer<typeof reactMessageInputSchema>;

export const discussionMutationResponseSchema = z.object({
  status: z.enum(['added', 'removed', 'updated']),
});

export type DiscussionMutationResponse = z.infer<
  typeof discussionMutationResponseSchema
>;
