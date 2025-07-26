CREATE TYPE "public"."enrollment_status" AS ENUM('active', 'suspended', 'completed');--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "enrollment_status" DEFAULT 'active' NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"course_structure" jsonb DEFAULT '{"totalLessons":0,"modules":[]}'::jsonb NOT NULL,
	"progress" jsonb DEFAULT '{"completedLessons":[]}'::jsonb NOT NULL,
	"progress_percentage" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_course_unique_idx" UNIQUE("user_id","course_id")
);
