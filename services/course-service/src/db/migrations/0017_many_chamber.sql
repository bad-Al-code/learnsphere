CREATE TYPE "public"."assignment_type" AS ENUM('individual', 'collaborative');--> statement-breakpoint
CREATE TABLE "assignment_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assignment_drafts_assignment_id_student_id_unique" UNIQUE("assignment_id","student_id")
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "type" "assignment_type" DEFAULT 'individual' NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD CONSTRAINT "assignment_drafts_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;