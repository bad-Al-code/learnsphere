CREATE TYPE "public"."ai_tutor_message_role" AS ENUM('user', 'model');--> statement-breakpoint
CREATE TABLE "ai_tutor_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tutor_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "ai_tutor_message_role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_tutor_conversations" ADD CONSTRAINT "ai_tutor_conversations_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_tutor_messages" ADD CONSTRAINT "ai_tutor_messages_conversation_id_ai_tutor_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_tutor_conversations"("id") ON DELETE cascade ON UPDATE no action;