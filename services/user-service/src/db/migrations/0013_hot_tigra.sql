CREATE TYPE "public"."study_goal_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."study_goal_type" AS ENUM('course_completion', 'assignment_completion', 'weekly_study_hours');--> statement-breakpoint
CREATE TABLE "study_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "study_goal_type" NOT NULL,
	"priority" "study_goal_priority" DEFAULT 'medium' NOT NULL,
	"target_value" integer NOT NULL,
	"current_value" integer DEFAULT 0 NOT NULL,
	"start_date" date DEFAULT now() NOT NULL,
	"target_date" date NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"related_course_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "study_goals" ADD CONSTRAINT "study_goals_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;