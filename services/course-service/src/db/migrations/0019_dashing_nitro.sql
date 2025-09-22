CREATE TYPE "public"."feedback_status" AS ENUM('reviewed', 'pending');--> statement-breakpoint
CREATE TABLE "ai_assignment_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"summary" text NOT NULL,
	"suggestions" jsonb NOT NULL,
	"detailed_feedback" text,
	"status" "feedback_status" DEFAULT 'reviewed' NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_assignment_feedback_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "ai_assignment_feedback" ADD CONSTRAINT "ai_assignment_feedback_submission_id_assignment_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."assignment_submissions"("id") ON DELETE cascade ON UPDATE no action;