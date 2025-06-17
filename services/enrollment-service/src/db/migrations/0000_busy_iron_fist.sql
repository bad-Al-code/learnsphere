CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"progress" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "unique_enrollment" UNIQUE("user_id","course_id")
);
