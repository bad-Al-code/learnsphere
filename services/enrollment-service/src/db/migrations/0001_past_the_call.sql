ALTER TABLE "enrollments" DROP CONSTRAINT "unique_enrollment";--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "progress" SET DEFAULT '{"completedLessons":[]}'::jsonb;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "course_structure" jsonb DEFAULT '{"totalLessons":0,"lessonIds":[]}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "progress_percentage" numeric(5, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "last_accessed_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "user_course_unique_idx" UNIQUE("user_id","course_id");