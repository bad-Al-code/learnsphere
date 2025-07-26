CREATE TYPE "public"."course_status" AS ENUM('draft', 'published');--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "status" "course_status" DEFAULT 'draft' NOT NULL;