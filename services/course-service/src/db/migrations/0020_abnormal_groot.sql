CREATE TYPE "public"."draft_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."draft_status" AS ENUM('draft', 'reviewing', 'completed');--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "title" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "status" "draft_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "priority" "draft_priority" DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "word_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment_drafts" ADD COLUMN "last_saved" timestamp DEFAULT now() NOT NULL;