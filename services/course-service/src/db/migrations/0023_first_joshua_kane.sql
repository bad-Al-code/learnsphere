CREATE TYPE "public"."re_grade_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD COLUMN "re_grade_status" "re_grade_status";