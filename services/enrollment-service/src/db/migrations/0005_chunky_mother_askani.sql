CREATE TABLE "daily_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instructor_id" uuid NOT NULL,
	"date" date NOT NULL,
	"logins" integer DEFAULT 0 NOT NULL,
	"discussions" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_activity_instructor_id_date_unique" UNIQUE("instructor_id","date")
);
