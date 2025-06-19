import {
  uuid,
  timestamp,
  unique,
  pgTable,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";

type CourseStructure = {
  totalLessons: number;
  lessonIds: string[];
};

type EnrollmentProgress = {
  completedLessons: string[];
};

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    courseId: uuid("course_id").notNull(),
    courseStructure: jsonb("course_structure")
      .$type<CourseStructure>()
      .notNull()
      .default({ totalLessons: 0, lessonIds: [] }),
    progress: jsonb("progress")
      .$type<EnrollmentProgress>()
      .notNull()
      .default({ completedLessons: [] }),
    progressPercentage: decimal("progress_percentage", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0.00"),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [unique("user_course_unique_idx").on(table.userId, table.courseId)];
  }
);
