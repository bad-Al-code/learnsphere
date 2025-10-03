CREATE TYPE "public"."mentorship_status" AS ENUM('open', 'filling-fast', 'full');--> statement-breakpoint
CREATE TABLE "mentorship_favorites" (
	"program_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "mentorship_favorites_program_id_user_id_pk" PRIMARY KEY("program_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "mentorship_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"mentor_id" uuid NOT NULL,
	"duration" varchar(50) NOT NULL,
	"commitment" varchar(50) NOT NULL,
	"next_cohort" date NOT NULL,
	"price" varchar(50) DEFAULT 'Free' NOT NULL,
	"tags" text[] NOT NULL,
	"total_spots" integer NOT NULL,
	"status" "mentorship_status" DEFAULT 'open' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mentorship_favorites" ADD CONSTRAINT "mentorship_favorites_program_id_mentorship_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."mentorship_programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_favorites" ADD CONSTRAINT "mentorship_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_programs" ADD CONSTRAINT "mentorship_programs_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;