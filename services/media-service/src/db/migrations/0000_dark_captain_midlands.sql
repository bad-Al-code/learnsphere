CREATE TYPE "public"."media_status" AS ENUM('uploading', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."upload_type" AS ENUM('avatar', 'video');--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"s3_key" text NOT NULL,
	"owner_user_id" uuid,
	"parent_entity_id" uuid,
	"upload_type" "upload_type" NOT NULL,
	"status" "media_status" DEFAULT 'uploading' NOT NULL,
	"error_message" text,
	"processed_urls" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_s3_key_unique" UNIQUE("s3_key")
);
