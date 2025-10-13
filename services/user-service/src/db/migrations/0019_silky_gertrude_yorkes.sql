CREATE TYPE "public"."waitlist_role" AS ENUM('student', 'instructor');--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "role" "waitlist_role" DEFAULT 'student' NOT NULL;