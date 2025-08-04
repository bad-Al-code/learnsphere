CREATE TYPE "public"."user_status" AS ENUM('active', 'instructor', 'pending_instructor_review', 'suspended');--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"bio" text,
	"avatar_url" jsonb,
	"headline" varchar(100),
	"website_url" text,
	"social_links" jsonb,
	"instructor_application_data" jsonb,
	"fcm_tokens" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"settings" jsonb DEFAULT '{"theme":"light","language":"en","notifications":{"newCourseAlerts":true,"weeklyNewsletter":false}}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
