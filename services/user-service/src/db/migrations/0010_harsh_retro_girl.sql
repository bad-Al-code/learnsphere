CREATE TYPE "public"."feedback_type" AS ENUM('Grammar', 'Style', 'Clarity', 'Argument');--> statement-breakpoint
CREATE TABLE "ai_writing_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"prompt" text,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_writing_feedback" (
	"assignment_id" uuid NOT NULL,
	"feedback_type" "feedback_type" NOT NULL,
	"feedback_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_writing_assignments" ADD CONSTRAINT "ai_writing_assignments_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_writing_feedback" ADD CONSTRAINT "ai_writing_feedback_assignment_id_ai_writing_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."ai_writing_assignments"("id") ON DELETE cascade ON UPDATE no action;