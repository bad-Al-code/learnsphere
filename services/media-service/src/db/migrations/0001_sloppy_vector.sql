ALTER TYPE "public"."upload_type" ADD VALUE 'course_thumbnail';--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "parent_entity_id" SET NOT NULL;