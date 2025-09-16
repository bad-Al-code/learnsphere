CREATE TABLE "ai_research_boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_research_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" uuid NOT NULL,
	"title" text NOT NULL,
	"source" varchar(255),
	"url" text,
	"description" text,
	"ai_summary" text,
	"user_notes" text,
	"tags" jsonb,
	"relevance" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_research_boards" ADD CONSTRAINT "ai_research_boards_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_research_findings" ADD CONSTRAINT "ai_research_findings_board_id_ai_research_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."ai_research_boards"("id") ON DELETE cascade ON UPDATE no action;