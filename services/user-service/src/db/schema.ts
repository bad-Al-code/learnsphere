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
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export type UserSettings = {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr' | string;
  notifications: {
    newCourseAlerts: boolean;
    weeklyNewsletter: boolean;
  };
};

export type InstructorApplicationData = {
  expertise: string;
  experience: string;
  motivation: string;
  submittedAt: string;
};

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'instructor',
  'pending_instructor_review',
  'suspended',
]);

export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  bio: text('bio'),
  avatarUrls: jsonb('avatar_url').$type<{
    small?: string;
    medium?: string;
    large?: string;
  }>(),
  headline: varchar('headline', { length: 100 }),
  websiteUrl: text('website_url'),
  socialLinks: jsonb('social_links').$type<{
    twitter?: string;
    linkedin?: string;
    github?: string;
  }>(),

  instructorApplicationData: jsonb(
    'instructor_application_data'
  ).$type<InstructorApplicationData>(),

  fcmTokens: text('fcm_tokens')
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),

  status: userStatusEnum('status').default('active').notNull(),
  dateOfBirth: date('date_of_birth'),
  lastKnownDevice: text('last_known_device'),
  settings: jsonb('settings')
    .$type<UserSettings>()
    .default({
      theme: 'light',
      language: 'en',
      notifications: {
        newCourseAlerts: true,
        weeklyNewsletter: false,
      },
    })
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiTutorMessageRoleEnum = pgEnum('ai_tutor_message_role', [
  'user',
  'model',
]);

export const aiTutorConversations = pgTable('ai_tutor_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull().default('New Chat'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiTutorMessages = pgTable('ai_tutor_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => aiTutorConversations.id, { onDelete: 'cascade' }),
  role: aiTutorMessageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type NewAITutorMessage = typeof aiTutorMessages.$inferInsert;
export type AITutorMessage = typeof aiTutorMessages.$inferSelect;

/**  AI QUIZZES */
export const aiQuizzes = pgTable('ai_quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiQuizQuestions = pgTable('ai_quiz_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id')
    .notNull()
    .references(() => aiQuizzes.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  order: integer('order').notNull(),
});

export const aiQuizOptions = pgTable('ai_quiz_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id')
    .notNull()
    .references(() => aiQuizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
});

export const aiQuizzesRelations = relations(aiQuizzes, ({ one, many }) => ({
  user: one(profiles, {
    fields: [aiQuizzes.userId],
    references: [profiles.userId],
  }),

  questions: many(aiQuizQuestions),
}));

export const aiQuizQuestionsRelations = relations(
  aiQuizQuestions,
  ({ one, many }) => ({
    quiz: one(aiQuizzes, {
      fields: [aiQuizQuestions.quizId],
      references: [aiQuizzes.id],
    }),

    options: many(aiQuizOptions, {
      relationName: 'aiQuizOptionsToAiQuizQuestions',
    }),
  })
);

export const aiQuizOptionsRelations = relations(aiQuizOptions, ({ one }) => ({
  question: one(aiQuizOptions, {
    fields: [aiQuizOptions.questionId],
    references: [aiQuizOptions.id],
    relationName: 'aiQuizOptionsToAiQuizQuestions',
  }),
}));

/**  SMART NOTES */
export const userNotes = pgTable('user_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  insights: jsonb('insights').$type<{
    keyConcepts?: string[];
    studyActions?: string[];
    knowledgeGaps?: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type NewUserNote = typeof userNotes.$inferInsert;
export type UserNote = typeof userNotes.$inferSelect;

export const userNotesRelations = relations(userNotes, ({ one }) => ({
  user: one(profiles, {
    fields: [userNotes.userId],
    references: [profiles.userId],
  }),
}));

/** RESEARCH WORKSPACE */
export const aiResearchBoards = pgTable('ai_research_boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type ResearchBoard = typeof aiResearchBoards.$inferSelect;

export const aiResearchFindings = pgTable('ai_research_findings', {
  id: uuid('id').primaryKey().defaultRandom(),
  boardId: uuid('board_id')
    .notNull()
    .references(() => aiResearchBoards.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  source: varchar('source', { length: 255 }),
  url: text('url'),
  description: text('description'),
  aiSummary: text('ai_summary'),
  userNotes: text('user_notes'),
  tags: jsonb('tags').$type<string[]>(),
  relevance: integer('relevance'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type ResearchFindings = typeof aiResearchFindings.$inferSelect;

export const aiResearchBoardsRelations = relations(
  aiResearchBoards,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [aiResearchBoards.userId],
      references: [profiles.userId],
    }),

    findings: many(aiResearchFindings),
  })
);

export const aiResearchFindingsRelations = relations(
  aiResearchFindings,
  ({ one }) => ({
    board: one(aiResearchBoards, {
      fields: [aiResearchFindings.boardId],
      references: [aiResearchBoards.id],
    }),
  })
);

/**
 * @table replicated_course_content
 * @description Stores a local, denormalized copy of course content.
 * This table is populated by listening to 'course.content.updated' events
 * from the course-service to enable fast, resilient context fetching for the AI tutor.
 */
export const replicatedCourseContent = pgTable('replicated_course_content', {
  courseId: uuid('course_id').primaryKey(),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * @table enrollments
 * @description Stores a local replica of user-course enrollments.
 * This table is populated by listening to 'user.enrolled' events
 * to allow for fast, local authorization checks.
 */
export const enrollments = pgTable(
  'enrollments',
  {
    userId: text('user_id')
      .notNull()
      .references(() => profiles.userId, { onDelete: 'cascade' }),
    courseId: uuid('course_id').notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.courseId] })]
);

export const profilesRelations = relations(profiles, ({ many }) => ({
  aiTutorConversations: many(aiTutorConversations),
  enrollments: many(enrollments),
  userNotes: many(userNotes),
  aiQuizzes: many(aiQuizzes),
  aiResearchBoards: many(aiResearchBoards),
}));

export const aiTutorConversationsRelations = relations(
  aiTutorConversations,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [aiTutorConversations.userId],
      references: [profiles.userId],
    }),
    messages: many(aiTutorMessages),
  })
);

export const aiTutorMessagesRelations = relations(
  aiTutorMessages,
  ({ one }) => ({
    conversation: one(aiTutorConversations, {
      fields: [aiTutorMessages.conversationId],
      references: [aiTutorConversations.id],
    }),
  })
);

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  profile: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.userId],
  }),
}));
