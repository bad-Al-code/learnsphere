ALTER TABLE "conversation_participants" ADD COLUMN "is_bookmarked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "course_id" uuid;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "views" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "is_resolved" boolean DEFAULT false;