CREATE TYPE "public"."activity_type" AS ENUM('enrollment', 'lesson_completion', 'discussion_post', 'resource_download');--> statement-breakpoint
CREATE TABLE "course_activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
