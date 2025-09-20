ALTER TABLE "conversations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "max_participants" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "is_live" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "start_time" timestamp;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "duration_minutes" integer;