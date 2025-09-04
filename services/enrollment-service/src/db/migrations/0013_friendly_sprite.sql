CREATE TYPE "public"."report_format" AS ENUM('csv', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "report_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"report_type" text NOT NULL,
	"format" "report_format" NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"file_url" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
