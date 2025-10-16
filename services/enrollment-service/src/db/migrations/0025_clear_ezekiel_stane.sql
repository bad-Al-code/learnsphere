ALTER TABLE "enrollments" ADD COLUMN "certificate_id" varchar(20);--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "certificate_url" text;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "is_favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_certificate_id_unique" UNIQUE("certificate_id");