CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "mentorship_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expertise" text NOT NULL,
	"experience" text NOT NULL,
	"availability" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mentorship_applications_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "mentorship_applications" ADD CONSTRAINT "mentorship_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;