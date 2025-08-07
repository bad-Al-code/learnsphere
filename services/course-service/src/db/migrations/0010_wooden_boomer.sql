ALTER TABLE "courses" RENAME COLUMN "duration_hours" TO "duration";--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "rating_count" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "enrollment_count" integer DEFAULT 0;