import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
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
import { AssignmentResponse } from '../features/ai/responseSchema/assignmentRecommendationResponse.schema';
import {
  AIProgressInsight,
  LearningEfficiency,
  LearningRecommendation,
  PerformancePrediction,
  PredictiveChartData,
} from '../features/ai/schema';
import { FeedbackResponseSchema } from '../features/ai/schema/feedback.schema';
import { StudyHabit } from '../schema';

type ModuleSnapshot = {
  id: string;
  title: string;
  lessonIds: string[];
};

type CourseStructure = {
  totalLessons: number;
  modules: ModuleSnapshot[];
};

type EnrollmentProgress = {
  completedLessons: string[];
};

export const enrollmentStatusEnum = pgEnum('enrollment_status', [
  'active',
  'suspended',
  'completed',
]);

export type EnrolllmentStatus =
  (typeof enrollmentStatusEnum.enumValues)[number];

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    status: enrollmentStatusEnum('status').notNull().default('active'),
    userId: uuid('user_id').notNull(),
    courseId: uuid('course_id').notNull(),
    coursePriceAtEnrollment: decimal('course_price_at_enrollment', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    courseStructure: jsonb('course_structure')
      .$type<CourseStructure>()
      .notNull()
      .default({ totalLessons: 0, modules: [] }),
    progress: jsonb('progress')
      .$type<EnrollmentProgress>()
      .notNull()
      .default({ completedLessons: [] }),
    progressPercentage: decimal('progress_percentage', {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),

    certificateId: varchar('certificate_id', { length: 20 }).unique(),
    certificateUrl: text('certificate_url'),
    tags: text('tags')
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    isFavorite: boolean('is_favorite').default(false).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    notes: text('notes'),

    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return [unique('user_course_unique_idx').on(table.userId, table.courseId)];
  }
);

export const courseStatusEnum = pgEnum('course_status', ['draft', 'published']);

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  instructorId: uuid('instructor_id').notNull(),
  status: courseStatusEnum('status').default('draft').notNull(),
  prerequisiteCourseId: uuid('prerequisite_course_id'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('student').notNull(),
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UpdatedCourse = Partial<Omit<NewCourse, 'id'>>;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const dailyActivity = pgTable(
  'daily_activity',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    instructorId: uuid('instructor_id').notNull(),
    date: date('date').notNull(),
    logins: integer('logins').default(0).notNull(),
    discussions: integer('discussions').default(0).notNull(),
  },
  (table) => [unique().on(table.instructorId, table.date)]
);

/**
@table student_grades
@description Stores a local replica of graded assignment submissions.
This table is populated by listening to 'assignment.submission.graded' events from the course-service.
*/
export const studentGrades = pgTable(
  'student_grades',
  {
    id: uuid('id').defaultRandom(),
    submissionId: uuid('submission_id').notNull(),
    assignmentId: uuid('assignment_id').notNull(),
    courseId: uuid('course_id').notNull(),
    moduleId: uuid('module_id'),
    studentId: uuid('student_id').notNull(),
    grade: integer('grade'),
    gradedAt: timestamp('graded_at'),
  },
  (table) => [primaryKey({ columns: [table.submissionId] })]
);

export type NewStudentGrade = typeof studentGrades.$inferInsert;
export type StudentGrade = typeof studentGrades.$inferSelect;

export const activityTypeEnum = pgEnum('activity_type', [
  'enrollment',
  'lesson_completion',
  'discussion_post',
  'resource_download',
]);

/**
@table course_activity_logs
@description A central log for all significant, time-stamped events related to a course.
*/
export const courseActivityLogs = pgTable('course_activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  userId: uuid('user_id').notNull(),
  activityType: activityTypeEnum('activity_type').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type NewActivityLog = typeof courseActivityLogs.$inferInsert;

export const enrollmentRelations = relations(enrollments, ({ one, many }) => ({
  activities: many(courseActivityLogs),
}));

export const courseActivityLogsRelations = relations(
  courseActivityLogs,
  ({ one }) => ({
    enrollment: one(enrollments, {
      fields: [courseActivityLogs.userId, courseActivityLogs.courseId],
      references: [enrollments.userId, enrollments.courseId],
    }),
  })
);

export const lessonSessions = pgTable('lesson_sessions', {
  sessionId: uuid('session_id').primaryKey(),
  userId: uuid('user_id').notNull(),
  courseId: uuid('course_id').notNull(),
  moduleId: uuid('module_id').notNull(),
  lessonId: uuid('lesson_id').notNull(),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  durationMinutes: integer('duration_minutes'),
});

export type NewLessonSession = typeof lessonSessions.$inferInsert;

export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);
export const reportFormatEnum = pgEnum('report_format', ['csv', 'pdf']);

export const reportJobs = pgTable('report_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id').notNull(),
  reportType: text('report_type').notNull(),
  format: reportFormatEnum('format').notNull(),
  status: reportStatusEnum('status').notNull().default('pending'),
  fileUrl: text('file_url'),
  errorMessage: text('error_message'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type NewReportJob = typeof reportJobs.$inferInsert;

export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  insights: jsonb('insights').$type<FeedbackResponseSchema>().notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});
export type AIInsight = typeof aiInsights.$inferSelect;

export const aiStudyRecommendations = pgTable('ai_study_recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  recommendations: jsonb('recommendations')
    .$type<AssignmentResponse>()
    .notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});
export type AIStudyRecommendation = typeof aiStudyRecommendations.$inferSelect;

/** AI Learnrning Paths */
export const aiLearningPaths = pgTable('ai_learning_paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  pathData: jsonb('path_data').$type<PredictiveChartData>().notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type AILearningPath = typeof aiLearningPaths.$inferSelect;

/** AI Performance Predictions */
export const aiPerformancePredictions = pgTable('ai_performance_predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  predictions: jsonb('predictions').$type<PerformancePrediction[]>().notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type AIPerformancePrediction =
  typeof aiPerformancePredictions.$inferSelect;

/** AI Learning Recommendataions */
export const aiLearningRecommendations = pgTable(
  'ai_learning_recommendations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique(),
    recommendations: jsonb('recommendations')
      .$type<LearningRecommendation[]>()
      .notNull(),
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
  }
);

export type AILearningRecommendation =
  typeof aiLearningRecommendations.$inferSelect;

/** AI Progress Insights */
export const aiProgressInsights = pgTable('ai_progress_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  insights: jsonb('insights').$type<AIProgressInsight[]>().notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type AIProgressInsightEntry = typeof aiProgressInsights.$inferSelect;

/** AI Learning Efficiency */
export const aiLearningEfficiency = pgTable('ai_learning_efficiency', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  efficiencyData: jsonb('efficiency_data')
    .$type<LearningEfficiency[]>()
    .notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type AILearningEfficiency = typeof aiLearningEfficiency.$inferSelect;

/** AI Study Habits */
export const aiStudyHabits = pgTable('ai_study_habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  habitsData: jsonb('habits_data').$type<StudyHabit[]>().notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type AIStudyHabitEntry = typeof aiStudyHabits.$inferSelect;
