CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"instructor_id" uuid NOT NULL
);
