CREATE TYPE "public"."course_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"instructor_id" uuid NOT NULL,
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"prerequisite_course_id" uuid
);
