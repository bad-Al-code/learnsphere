ALTER TABLE "lessons" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;