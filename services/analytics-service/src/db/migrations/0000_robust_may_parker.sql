CREATE TABLE "course_stats" (
	"course_id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"instructor_id" uuid NOT NULL,
	"total_enrollments" integer DEFAULT 0 NOT NULL,
	"total_revenue" numeric(10, 2) DEFAULT '0' NOT NULL,
	"average_completion_rate" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instructor_daily_stats" (
	"instructor_id" uuid NOT NULL,
	"date" date NOT NULL,
	"total_revenue" numeric(10, 2) DEFAULT '0' NOT NULL,
	"enrollments" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "instructor_daily_stats_instructor_id_date_pk" PRIMARY KEY("instructor_id","date")
);
