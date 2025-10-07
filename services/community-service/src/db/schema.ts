import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  role: userRoleEnum('role').default('student').notNull(),
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
    isPrivate: boolean('is_private').default(false),

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

export const reactionTypeEnum = pgEnum('reaction_type', [
  'like',
  'upvote',
  'downvote',
  'star',
  'heart',
  'sparkles',
]);

export const reactions = pgTable(
  'reactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    messageId: uuid('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    reaction: reactionTypeEnum('reaction').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('reactions_message_user_upvote_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'upvote'`),
    uniqueIndex('reactions_message_user_downvote_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'downvote'`),
    uniqueIndex('reactions_message_user_like_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'like'`),
    uniqueIndex('reactions_message_user_star_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'star'`),
    uniqueIndex('reactions_message_user_heart_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'heart'`),
    uniqueIndex('reactions_message_user_sparkles_idx')
      .on(table.messageId, table.userId)
      .where(sql`${table.reaction} = 'sparkles'`),
  ]
);

/** Mentorship Program */
export const mentorshipStatusEnum = pgEnum('mentorship_status', [
  'open',
  'filling-fast',
  'full',
]);
export type MentorshipStatus = (typeof mentorshipStatusEnum.enumValues)[number];

export const mentorshipPrograms = pgTable('mentorship_programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  mentorId: uuid('mentor_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  duration: varchar('duration', { length: 50 }).notNull(),
  commitment: varchar('commitment', { length: 50 }).notNull(),
  nextCohort: date('next_cohort').notNull(),
  price: varchar('price', { length: 50 }).default('Free').notNull(),
  focusAreas: text('tags').array().notNull(),
  totalSpots: integer('total_spots').notNull(),
  status: mentorshipStatusEnum('status').default('open').notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Mentorship = typeof mentorshipPrograms.$inferSelect;
export type NewMentorship = typeof mentorshipPrograms.$inferInsert;

export const mentorshipFavorites = pgTable(
  'mentorship_favorites',
  {
    programId: uuid('program_id')
      .references(() => mentorshipPrograms.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.programId, table.userId] })]
);

export type MentorshipFavorites = typeof mentorshipFavorites.$inferSelect;

export const mentorshipProgramsRelations = relations(
  mentorshipPrograms,
  ({ one, many }) => ({
    mentor: one(users, {
      fields: [mentorshipPrograms.mentorId],
      references: [users.id],
    }),
    favorites: many(mentorshipFavorites),
  })
);

export const mentorshipFavoritesRelations = relations(
  mentorshipFavorites,
  ({ one }) => ({
    program: one(mentorshipPrograms, {
      fields: [mentorshipFavorites.programId],
      references: [mentorshipPrograms.id],
    }),
    user: one(users, {
      fields: [mentorshipFavorites.userId],
      references: [users.id],
    }),
  })
);

export const applicationStatusEnum = pgEnum('application_status', [
  'pending',
  'approved',
  'rejected',
]);

export const mentorshipApplications = pgTable('mentorship_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  expertise: text('expertise').notNull(),
  experience: text('experience').notNull(),
  availability: text('availability').notNull(),
  status: applicationStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type MentorshipApplication = typeof mentorshipApplications.$inferSelect;
export type NewMentorshipApplication =
  typeof mentorshipApplications.$inferInsert;

/** EVENTS */
export const eventTypeEnum = pgEnum('event_type', [
  'Workshop',
  'Competition',
  'Networking',
]);
export type EventType = (typeof eventTypeEnum.enumValues)[number];

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    type: eventTypeEnum('type').notNull(),
    hostId: uuid('host_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    date: timestamp('date').notNull(),
    location: text('location').notNull(),
    maxAttendees: integer('max_attendees').notNull(),
    tags: text('tags').array(),
    isLive: boolean('is_live').default(false).notNull(),
    prize: text('prize'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('unique_user_title_date').on(table.hostId, table.title, table.date),
  ]
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export const eventAttendees = pgTable(
  'event_attendees',
  {
    eventId: uuid('event_id')
      .references(() => events.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })]
);
export type EventAttendees = typeof eventAttendees.$inferSelect;

export const eventsRelations = relations(events, ({ one, many }) => ({
  host: one(users, { fields: [events.hostId], references: [users.id] }),
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, { fields: [eventAttendees.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversationParticipants),
  messages: many(messages),
  mentorshipsHosted: many(mentorshipPrograms),
  mentorshipFavorites: many(mentorshipFavorites),
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

export const messagesRelations = relations(messages, ({ one, many }) => ({
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
  reactions: many(reactions),
}));

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type ReactionType = (typeof reactionTypeEnum.enumValues)[number];
export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;
