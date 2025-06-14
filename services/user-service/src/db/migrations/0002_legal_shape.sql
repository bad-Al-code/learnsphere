ALTER TABLE "profiles" ADD COLUMN "headline" varchar(100);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "social_links" jsonb;