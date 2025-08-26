CREATE TABLE "student_grades" (
	"submission_id" uuid NOT NULL,
	"assignment_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"grade" integer NOT NULL,
	"graded_at" timestamp NOT NULL,
	CONSTRAINT "student_grades_submission_id_pk" PRIMARY KEY("submission_id")
);
