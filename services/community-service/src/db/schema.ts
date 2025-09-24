import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const conversationTypeEnum = pgEnum('conversation_type', [
  'direct',
  'group',
]);

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: conversationTypeEnum('type').notNull(),
    name: varchar('name', { length: 255 }),
    createdById: uuid('created_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    maxParticipants: integer('max_participants').default(10),
    isLive: boolean('is_live').default(false),
    startTime: timestamp('start_time'),
    durationMinutes: integer('duration_minutes'),
    courseId: uuid('course_id'),
    assignmentId: uuid('assignment_id'),
    tags: text('tags').array(),
    views: integer('views').default(0),
    isResolved: boolean('is_resolved').default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [unique('creator_name_unique').on(table.createdById, table.name)]
);

export const conversationParticipants = pgTable(
  'conversation_participants',
  {
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    lastReadTimestamp: timestamp('last_read_timestamp'),
    isBookmarked: boolean('is_bookmarked').default(false),
  },
  (table) => [primaryKey({ columns: [table.conversationId, table.userId] })]
);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  replyingToMessageId: uuid('replying_to_message_id').references(
    (): any => messages.id,
    { onDelete: 'set null' }
  ),
  reactions: jsonb('reactions').$type<Record<string, string[]>>(),

  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  replyingTo: one(messages, {
    fields: [messages.replyingToMessageId],
    references: [messages.id],
    relationName: 'replies',
  }),
}));

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;
