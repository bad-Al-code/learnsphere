import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export type UserSettings = {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr' | string;
  city?: string;
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

export const profilesRelations = relations(profiles, ({ many }) => ({
  aiTutorConversations: many(aiTutorConversations),
  enrollments: many(enrollments),
  userNotes: many(userNotes),
  aiQuizzes: many(aiQuizzes),
  aiResearchBoards: many(aiResearchBoards),
  aiFlashcardDecks: many(aiFlashcardDecks),
  aiWritingAssignments: many(aiWritingAssignments),
  integrations: many(userIntegrations),
}));

/** INTEGRATION HUB */
export const integrationProviderEnum = pgEnum('integration_provider', [
  'google_calendar',
  'outlook_calendar',
  'gmail',
  'google_drive',
  'dropbox',
  'canvas_lms',
  'blackboard_learn',
  'moodle',
  'slack',
  'notion',
]);

export const integrationStatusEnum = pgEnum('integration_status', [
  'active',
  'revoked',
  'error',
]);

export const userIntegrations = pgTable(
  'user_integrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => profiles.userId, { onDelete: 'cascade' }),
    provider: integrationProviderEnum('provider').notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    scopes: text('scopes').array(),
    status: integrationStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [unique('user_provider_unique').on(table.userId, table.provider)]
);
export type UserIntegration = typeof userIntegrations.$inferSelect;
export type NewUserIntegration = typeof userIntegrations.$inferInsert;

export const userIntegrationsRelations = relations(
  userIntegrations,
  ({ one }) => ({
    user: one(profiles, {
      fields: [userIntegrations.userId],
      references: [profiles.userId],
    }),
  })
);

/** AI Tutor */
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
export type AITutorConversation = typeof aiTutorConversations.$inferSelect;

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

/** FLASHCARD SYSTEM */
export const aiFlashcardDecks = pgTable('ai_flashcard_decks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type FlashcardDecks = typeof aiFlashcardDecks.$inferSelect;

export const aiFlashcards = pgTable('ai_flashcards', {
  id: uuid('id').primaryKey().defaultRandom(),
  deckId: uuid('deck_id')
    .notNull()
    .references(() => aiFlashcardDecks.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
});
export type Flashcard = typeof aiFlashcards.$inferSelect;

export const flashcardProgressStatusEnum = pgEnum('flashcard_progress_status', [
  'New',
  'Learning',
  'Mastered',
]);

export const userFlashcardProgress = pgTable(
  'user_flashcard_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => profiles.userId, { onDelete: 'cascade' }),
    cardId: uuid('card_id')
      .notNull()
      .references(() => aiFlashcards.id, { onDelete: 'cascade' }),
    deckId: uuid('deck_id')
      .notNull()
      .references(() => aiFlashcardDecks.id, { onDelete: 'cascade' }),
    status: flashcardProgressStatusEnum('status').notNull().default('New'),
    nextReviewAt: timestamp('next_review_at').notNull().defaultNow(),
    lastReviewedAt: timestamp('last_reviewed_at'),
    correctStreaks: integer('correct_streaks').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cardId] })]
);
export type NewUserFlashcardProgress =
  typeof userFlashcardProgress.$inferInsert;

export const aiFlashcardDecksRelations = relations(
  aiFlashcardDecks,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [aiFlashcardDecks.userId],
      references: [profiles.userId],
    }),
    cards: many(aiFlashcards),
  })
);

export const aiFlashcardsRelations = relations(
  aiFlashcards,
  ({ one, many }) => ({
    deck: one(aiFlashcardDecks, {
      fields: [aiFlashcards.deckId],
      references: [aiFlashcardDecks.id],
    }),
    progress: many(userFlashcardProgress),
  })
);

export const userFlashcardProgressRelations = relations(
  userFlashcardProgress,
  ({ one }) => ({
    user: one(profiles, {
      fields: [userFlashcardProgress.userId],
      references: [profiles.userId],
    }),
    card: one(aiFlashcards, {
      fields: [userFlashcardProgress.cardId],
      references: [aiFlashcards.id],
    }),
  })
);

/** AI WRITING WORKSPACE*/
export const aiWritingAssignments = pgTable('ai_writing_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  prompt: text('prompt'),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type WritingAssignment = typeof aiWritingAssignments.$inferSelect;
export type NewWritingAssignment = typeof aiWritingAssignments.$inferInsert;

export const feedbackTypeEnum = pgEnum('feedback_type', [
  'Grammar',
  'Style',
  'Clarity',
  'Argument',
]);
export type FeedbackType = (typeof feedbackTypeEnum.enumValues)[number];

export const aiWritingFeedback = pgTable('ai_writing_feedback', {
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => aiWritingAssignments.id, { onDelete: 'cascade' }),
  feedbackType: feedbackTypeEnum('feedback_type').notNull(),
  feedbackText: text('feedback_text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type NewWritingFeedback = typeof aiWritingFeedback.$inferInsert;
export type WritingFeedback = typeof aiWritingFeedback.$inferSelect;

export const aiWritingAssignmentsRelations = relations(
  aiWritingAssignments,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [aiWritingAssignments.userId],
      references: [profiles.userId],
    }),

    feedback: many(aiWritingFeedback),
  })
);

export const aiWritingFeedbackRelations = relations(
  aiWritingFeedback,
  ({ one }) => ({
    assignment: one(aiWritingAssignments, {
      fields: [aiWritingFeedback.assignmentId],
      references: [aiWritingAssignments.id],
    }),
  })
);

/** STUDY GOAL */
export const studyGoalTypeEnum = pgEnum('study_goal_type', [
  'course_completion',
  'assignment_completion',
  'weekly_study_hours',
]);
export type StudyGoalTypeEnum = (typeof studyGoalTypeEnum.enumValues)[number];

export const studyGoalPriorityEnum = pgEnum('study_goal_priority', [
  'low',
  'medium',
  'high',
]);

export const studyGoals = pgTable('study_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  type: studyGoalTypeEnum('type').notNull(),
  priority: studyGoalPriorityEnum('priority').default('medium').notNull(),
  targetValue: integer('target_value').notNull(),
  currentValue: integer('current_value').default(0).notNull(),
  startDate: date('start_date').defaultNow().notNull(),
  targetDate: date('target_date').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  relatedCourseId: uuid('related_course_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type StudyGoal = typeof studyGoals.$inferSelect;
export type NewStudyGoal = typeof studyGoals.$inferInsert;
export type UpdateStudyGoal = typeof studyGoals.$inferSelect;

/** Waitlist */
export const waitlistRoleEnum = pgEnum('waitlist_role', [
  'student',
  'instructor',
]);
export type WaitlistRoleEnum = (typeof waitlistRoleEnum.enumValues)[number];

export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  referralCode: varchar('referral_code', { length: 8 }).notNull().unique(),
  referredById: uuid('referred_by_id').references((): any => waitlist.id, {
    onDelete: 'set null',
  }),
  referralCount: integer('referral_count').default(0).notNull(),
  waitlistPosition: serial('waitlist_position').notNull(),
  rewardsUnlocked: text('rewards_unlocked')
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  interests: text('interests')
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  role: waitlistRoleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;

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

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  profile: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.userId],
  }),
}));
